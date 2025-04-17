use crate::internal::{Account, AccountGateway};

#[derive(serde::Deserialize, serde::Serialize)]
pub struct UpdatedBalanceInputDTO {
    pub account_id_from: String,
    pub account_id_to: String,
    pub balance_account_id_from: f64,
    pub balance_account_id_to: f64,
}

pub struct UpdateBalanceUseCase<T>
where
    T: AccountGateway,
{
    pub account_db: T,
}

impl<T> UpdateBalanceUseCase<T>
where
    T: AccountGateway,
{
    pub fn new(account_db: T) -> Self {
        UpdateBalanceUseCase { account_db }
    }

    pub async fn execute(&mut self, input: UpdatedBalanceInputDTO) -> Result<(), sqlx::Error> {
        let account_from = Account::new(&input.account_id_from, input.balance_account_id_from);
        let account_to = Account::new(&input.account_id_to, input.balance_account_id_to);

        self.account_db
            .update_balance(account_from)
            .await
            .map_err(|e| {
                eprintln!(
                    "Failed to update balance for account {}: {:?}",
                    input.account_id_from, e
                );
                e
            })?;

        self.account_db
            .update_balance(account_to)
            .await
            .map_err(|e| {
                eprintln!(
                    "Failed to update balance for account {}: {:?}",
                    input.account_id_to, e
                );
                e
            })?;

        Ok(())
    }
}
