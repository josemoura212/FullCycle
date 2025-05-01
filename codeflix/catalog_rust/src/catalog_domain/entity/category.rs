use chrono::{DateTime, Utc};
use uuid::Uuid;

use crate::catalog_domain::EntityValidationException;

#[derive(Debug, serde::Serialize, serde::Deserialize)]
pub struct Category {
    pub id: Uuid,
    pub name: String,
    pub description: String,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
}

impl Category {
    pub fn new(
        name: String,
        description: String,
        is_active: Option<bool>,
    ) -> Result<Self, EntityValidationException> {
        validate(&name)?;
        Ok(Self {
            id: Uuid::new_v4(),
            name,
            description,
            is_active: is_active.unwrap_or(true),
            created_at: Utc::now(),
        })
    }
}

fn validate(name: &str) -> Result<(), EntityValidationException> {
    if name.trim().is_empty() {
        return Err(EntityValidationException::new(Some(
            "Name cannot be empty or whitespace".to_string(),
        )));
    }

    if name.len() < 3 {
        return Err(EntityValidationException::new(Some(
            "Name must be at least 3 characters long".to_string(),
        )));
    }

    Ok(())
}
