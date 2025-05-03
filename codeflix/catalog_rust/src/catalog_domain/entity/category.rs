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
        let category = Self {
            id: Uuid::new_v4(),
            name,
            description,
            is_active: is_active.unwrap_or(true),
            created_at: Utc::now(),
        };

        validate(&category)?;
        Ok(category)
    }

    pub fn update(
        &mut self,
        name: String,
        description: Option<String>,
    ) -> Result<(), EntityValidationException> {
        self.name = name;
        if let Some(desc) = description {
            self.description = desc;
        }
        validate(self)
    }

    pub fn activate(&mut self) -> Result<(), EntityValidationException> {
        self.is_active = true;
        validate(self)
    }

    pub fn deactivate(&mut self) -> Result<(), EntityValidationException> {
        self.is_active = false;
        validate(self)
    }
}

fn validate(category: &Category) -> Result<(), EntityValidationException> {
    if category.name.trim().is_empty() {
        return Err(EntityValidationException::new(Some(
            "Name cannot be empty or whitespace".to_string(),
        )));
    }

    if category.name.len() < 3 {
        return Err(EntityValidationException::new(Some(
            "Name must be at least 3 characters long".to_string(),
        )));
    }

    if category.name.len() > 255 {
        return Err(EntityValidationException::new(Some(
            "Name should be less or equal 255  characters long".to_string(),
        )));
    }

    if category.description.len() > 10_000 {
        return Err(EntityValidationException::new(Some(
            "Description should be less or equal 10.000 characters long".to_string(),
        )));
    }

    Ok(())
}
