use actix_web::{App, HttpServer, web};
use internal::{update_balance::UpdateBalanceUseCase, update_balance_event::consume_kafka};

mod internal;

struct AppState {
    kafka_url: String,
    account_db: internal::account_db::AccountDb,
}

impl AppState {
    async fn new() -> Self {
        dotenv::dotenv().ok();

        let app_environment =
            std::env::var("APP_ENVIRONMENT").unwrap_or_else(|_| "development".to_string());

        let result = if app_environment == "development" {
            (
                "postgres://postgres:postgres@balances-db:5432/balances".to_string(),
                "kafka:29092".to_string(),
            )
        } else {
            (
                "postgres://postgres:postgres@localhost:5432/balances".to_string(),
                "localhost:9092".to_string(),
            )
        };

        let account_db = internal::account_db::AccountDb::new(&result.0).await;

        AppState {
            account_db,
            kafka_url: result.1,
        }
    }
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let app_state = AppState::new().await;

    let updated_balance_use_case = UpdateBalanceUseCase::new(app_state.account_db.clone());

    tokio::spawn(consume_kafka(updated_balance_use_case, app_state.kafka_url));

    println!("Server Runing");

    HttpServer::new(move || {
        let account_db = app_state.account_db.clone();
        App::new().app_data(web::Data::new(account_db)).route(
            "/balances/{account_id}",
            web::get().to(internal::account_handler::get_balance),
        )
    })
    .bind(("0.0.0.0", 3003))?
    .run()
    .await
}
