use sqlx::Error;

use crate::internal::Account;

pub trait AccountGateway {
    async fn update_balance(&mut self, account: Account) -> Result<(), Error>;
    async fn get_balance(&self, id: &str) -> Result<Account, Error>;
}
