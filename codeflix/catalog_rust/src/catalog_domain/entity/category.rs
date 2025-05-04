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
    use crate::catalog_domain::validation::domain_validation::DomainValidation;

    DomainValidation::not_empty_or_whitespace(&category.name, "Name")?;
    DomainValidation::min_length(&category.name, "Name", 3)?;
    DomainValidation::max_length(&category.name, "Name", 255)?;
    DomainValidation::max_length(&category.description, "Description", 10000)?;

    Ok(())
}
