use rdkafka::{
    Message,
    consumer::{Consumer, StreamConsumer},
};
use serde::{Deserialize, Serialize};

use crate::internal::{
    account_db::AccountDb,
    update_balance::{UpdateBalanceUseCase, UpdatedBalanceInputDTO},
};

#[derive(Deserialize, Serialize)]
#[serde(rename_all = "PascalCase")]
struct BalanceUpdatedEvent {
    name: String,
    payload: UpdatedBalanceInputDTO,
}

pub async fn consume_kafka(mut use_case: UpdateBalanceUseCase<AccountDb>, connection: String) {
    let consumer: StreamConsumer = rdkafka::config::ClientConfig::new()
        .set("bootstrap.servers", connection)
        .set("client.id", "balances")
        .set("group.id", "balances")
        .set("auto.offset.reset", "earliest")
        .set("fetch.min.bytes", "1")
        .set("fetch.wait.max.ms", "10")
        .set("session.timeout.ms", "6000")
        .set("heartbeat.interval.ms", "2000")
        .create()
        .expect("Failed to create Kafka consumer");

    if let Err(e) = consumer.subscribe(&["balances"]) {
        eprintln!("Failed to subscribe to topic 'balances': {:?}", e);
        return;
    }

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

                            use_case.execute(payload).await.unwrap_or_else(|e| {
                                eprintln!("Failed to execute use case: {:?}", e);
                            });
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
