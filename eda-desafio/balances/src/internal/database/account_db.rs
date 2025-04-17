use sqlx::Error;

use crate::internal::{Account, AccountGateway};

#[derive(Clone)]
pub struct AccountDb {
    pub db: sqlx::PgPool,
}

impl AccountDb {
    pub async fn new(database_url: &str) -> Self {
        let db = sqlx::PgPool::connect(database_url)
            .await
            .expect("Failed to connect to the database");
        Self { db }
    }
}

impl AccountGateway for AccountDb {
    async fn update_balance(&mut self, account: Account) -> Result<(), sqlx::Error> {
        sqlx::query!(
            "INSERT INTO balances (account_id, balance) VALUES ($1, $2)
                                 ON CONFLICT (account_id) DO UPDATE SET balance = $2",
            account.id,
            account.balance
        )
        .execute(&self.db)
        .await?;

        Ok(())
    }

    async fn get_balance(&self, id: &str) -> Result<Account, sqlx::Error> {
        let result = sqlx::query!("SELECT balance FROM balances WHERE account_id = $1", id)
            .fetch_optional(&self.db)
            .await?;
        if let Some(row) = result {
            Ok(Account::new(id, row.balance))
        } else {
            Err(Error::RowNotFound)
        }
    }
}
