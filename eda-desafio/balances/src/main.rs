use actix_web::{App, HttpServer, Responder, web};
use rdkafka::consumer::{Consumer, StreamConsumer};
use rdkafka::message::Message;
use serde::{Deserialize, Serialize};
use sqlx::PgPool;

#[derive(Deserialize, Serialize)]
struct Balance {
    account_id: String,
    balance: f64,
}

#[derive(Deserialize, Serialize)]
struct BalanceUpdatedPayload {
    account_id_from: String,
    account_id_to: String,
    balance_account_id_from: f64,
    balance_account_id_to: f64,
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "PascalCase")]
struct BalanceUpdatedEvent {
    name: String,
    payload: BalanceUpdatedPayload,
}

async fn get_balance(pool: web::Data<PgPool>, account_id: web::Path<String>) -> impl Responder {
    let result = sqlx::query_as!(
        Balance,
        "SELECT account_id, balance FROM balances WHERE account_id = $1",
        account_id.into_inner()
    )
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(balance) => web::Json(balance),
        Err(_) => web::Json(Balance {
            account_id: "Account not found".to_string(),
            balance: 0.0,
        }),
    }
}

async fn consume_kafka(pool: PgPool) {
    let consumer: StreamConsumer = rdkafka::config::ClientConfig::new()
        .set("bootstrap.servers", "kafka:29092")
        .set("client.id", "balances")
        .set("group.id", "balances")
        .set("auto.offset.reset", "earliest")
        .set("fetch.min.bytes", "1")
        .set("fetch.wait.max.ms", "10")
        .set("session.timeout.ms", "6000")
        .set("heartbeat.interval.ms", "2000")
        .create()
        .expect("Failed to create Kafka consumer");

    println!("Kafka consumer created successfully");

    if let Err(e) = consumer.subscribe(&["balances"]) {
        eprintln!("Failed to subscribe to topic 'balances': {:?}", e);
        return;
    }

    println!("Subscribed to topic 'balances' with group.id 'balances'");

    loop {
        match consumer.recv().await {
            Err(e) => {
                eprintln!("Kafka error: {}", e);
            }
            Ok(message) => {
                if let Some(payload) = message.payload() {
                    if let Ok(event) = serde_json::from_slice::<BalanceUpdatedEvent>(payload) {
                        if event.name == "BalanceUpdated" {
                            let payload = event.payload;

                            if let Err(e) = sqlx::query!(
                                "INSERT INTO balances (account_id, balance) VALUES ($1, $2)
                                 ON CONFLICT (account_id) DO UPDATE SET balance = $2",
                                payload.account_id_from,
                                payload.balance_account_id_from
                            )
                            .execute(&pool)
                            .await
                            {
                                eprintln!("Failed to update balance for account_id_from: {:?}", e);
                            } else {
                                println!(
                                    "Updated balance for account_id_from: {} to {}",
                                    payload.account_id_from, payload.balance_account_id_from
                                );
                            }

                            if let Err(e) = sqlx::query!(
                                "INSERT INTO balances (account_id, balance) VALUES ($1, $2)
                                 ON CONFLICT (account_id) DO UPDATE SET balance = $2",
                                payload.account_id_to,
                                payload.balance_account_id_to
                            )
                            .execute(&pool)
                            .await
                            {
                                eprintln!("Failed to update balance for account_id_to: {:?}", e);
                            } else {
                                println!(
                                    "Updated balance for account_id_to: {} to {}",
                                    payload.account_id_to, payload.balance_account_id_to
                                );
                            }
                        }
                    } else {
                        eprintln!("Failed to deserialize Kafka message payload");
                    }
                } else {
                    eprintln!("Received Kafka message with no payload");
                }
            }
        }
    }
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let pool = PgPool::connect("postgres://postgres:postgres@balances-db:5432/balances")
        .await
        .expect("Failed to connect to database");

    tokio::spawn(consume_kafka(pool.clone()));

    println!("Server Runing");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(pool.clone()))
            .route("/balances/{account_id}", web::get().to(get_balance))
    })
    .bind(("0.0.0.0", 3003))?
    .run()
    .await
}
