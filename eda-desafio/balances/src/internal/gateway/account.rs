use sqlx::Error;

use crate::internal::Account;

pub trait AccountGateway {
    async fn update_balance(&mut self, account: Account) -> Result<(), Error>;
    async fn find_by_id(&self, id: &str) -> Result<Account, Error>;
}
