#[derive(serde::Deserialize, serde::Serialize, Clone, Debug)]
pub struct Account {
    pub id: String,
    pub balance: f64,
}

impl Account {
    pub fn new(id: &str, balance: f64) -> Self {
        Account {
            id: id.to_string(),
            balance,
        }
    }
}
