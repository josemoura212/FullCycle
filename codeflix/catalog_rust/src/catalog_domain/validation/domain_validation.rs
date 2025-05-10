use crate::catalog_domain::EntityValidationError;

pub struct DomainValidation;

impl DomainValidation {
    pub fn not_empty_or_whitespace(
        value: &str,
        field_name: &str,
    ) -> Result<(), EntityValidationError> {
        if value.trim().is_empty() {
            return Err(EntityValidationError::new(Some(format!(
                "{} should not be empty or whitespace",
                field_name
            ))));
        }
        Ok(())
    }

    pub fn min_length(
        value: &str,
        field_name: &str,
        min_length: usize,
    ) -> Result<(), EntityValidationError> {
        if value.len() < min_length {
            return Err(EntityValidationError::new(Some(format!(
                "{} should be at least {} characters long",
                field_name, min_length
            ))));
        }
        Ok(())
    }
    pub fn max_length(
        value: &str,
        field_name: &str,
        max_length: usize,
    ) -> Result<(), EntityValidationError> {
        if value.len() > max_length {
            return Err(EntityValidationError::new(Some(format!(
                "{} should be less or equal {} characters long",
                field_name, max_length
            ))));
        }
        Ok(())
    }
}
