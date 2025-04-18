use sqlx::Error;

use crate::internal::{Account, AccountGateway};
#[allow(unused_imports)]
use sqlx::{Executor, PgPool};
#[allow(unused_imports)]
use uuid::Uuid;

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

    async fn find_by_id(&self, id: &str) -> Result<Account, sqlx::Error> {
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
#[cfg(test)]
mod tests {
    use super::*;

    async fn setup_test_db() -> PgPool {
        let admin_url = "postgres://postgres:postgres@localhost:5432/postgres";
        let admin_pool = PgPool::connect(admin_url)
            .await
            .expect("Failed to connect to admin database");

        let db_exists =
            sqlx::query_scalar::<_, i32>("SELECT 1 FROM pg_database WHERE datname = 'test_db';")
                .fetch_optional(&admin_pool)
                .await
                .expect("Failed to check if database exists")
                .is_some();

        if !db_exists {
            admin_pool
                .execute("CREATE DATABASE test_db;")
                .await
                .expect("Failed to create test database");
        }

        let database_url = "postgres://postgres:postgres@localhost:5432/test_db";

        let pool = PgPool::connect(database_url)
            .await
            .expect("Failed to connect to test database");

        pool.execute(
            r#"
                    DROP TABLE IF EXISTS balances;
                    CREATE TABLE balances (
                        account_id VARCHAR PRIMARY KEY,
                        balance FLOAT NOT NULL
                    );
                    "#,
        )
        .await
        .expect("Failed to create table");

        pool
    }

    #[tokio::test]
    async fn test_update_balance() {
        let db = setup_test_db().await;
        let mut account_db = AccountDb { db };

        let account_id = Uuid::new_v4().to_string();
        let account = Account::new(&account_id, 100.0);

        let result = account_db.update_balance(account).await;
        assert!(result.is_ok());

        let fetched_account = account_db.find_by_id(&account_id).await.unwrap();
        assert_eq!(fetched_account.id, account_id);
        assert_eq!(fetched_account.balance, 100.0);
    }

    #[tokio::test]
    async fn test_get_balance_not_found() {
        let db = setup_test_db().await;
        let account_db = AccountDb { db };

        let account_id = Uuid::new_v4().to_string();
        let result = account_db.find_by_id(&account_id).await;

        assert!(result.is_err());
        assert!(matches!(result.unwrap_err(), sqlx::Error::RowNotFound));
    }

    #[tokio::test]
    async fn test_update_balance_existing_account() {
        let db = setup_test_db().await;
        let mut account_db = AccountDb { db };

        let account_id = Uuid::new_v4().to_string();
        let initial_account = Account::new(&account_id, 100.0);
        account_db.update_balance(initial_account).await.unwrap();

        let updated_account = Account::new(&account_id, 200.0);
        account_db.update_balance(updated_account).await.unwrap();

        let fetched_account = account_db.find_by_id(&account_id).await.unwrap();
        assert_eq!(fetched_account.id, account_id);
        assert_eq!(fetched_account.balance, 200.0);
    }
}
