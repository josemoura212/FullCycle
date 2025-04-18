use actix_web::{Responder, web};

use crate::internal::{Account, AccountGateway, account_db::AccountDb};

pub async fn get_balance(
    account_db: web::Data<AccountDb>,
    account_id: web::Path<String>,
) -> impl Responder {
    let account_id = account_id.into_inner();

    let result = account_db.find_by_id(&account_id).await;

    match result {
        Ok(account) => web::Json(account),
        Err(_) => actix_web::HttpResponse::NotFound().body("Account not found"),
    }
}
