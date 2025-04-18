use actix_web::{HttpResponse, web};

use crate::internal::{AccountGateway, account_db::AccountDb};

pub async fn get_balance(
    account_db: web::Data<AccountDb>,
    account_id: web::Path<String>,
) -> HttpResponse {
    let account_id = account_id.into_inner();

    let result = account_db.find_by_id(&account_id).await;

    match result {
        Ok(account) => HttpResponse::Ok().json(account),
        Err(_) => HttpResponse::NotFound().body("Account not found"),
    }
}
