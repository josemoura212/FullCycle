use actix_web::{Responder, web};

use crate::internal::{Account, AccountGateway, account_db::AccountDb};

pub async fn get_balance(
    account_db: web::Data<AccountDb>,
    account_id: web::Path<String>,
) -> impl Responder {
    let account_id = account_id.into_inner();

    let result = account_db.get_balance(&account_id).await;

    match result {
        Ok(account) => web::Json(account),
        Err(_) => web::Json(Account {
            id: "Account not found".to_string(),
            balance: 0.0,
        }),
    }
}
