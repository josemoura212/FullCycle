use std::fmt;

pub struct EntityValidationError {
    pub message: Option<String>,
}

impl EntityValidationError {
    pub fn new(message: Option<String>) -> Self {
        Self { message }
    }
}

impl fmt::Display for EntityValidationError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match &self.message {
            Some(msg) => write!(f, "{}", msg),
            None => write!(f, "Entity validation error"),
        }
    }
}

impl fmt::Debug for EntityValidationError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "EntityValidationError: {:?}", self.message)
    }
}

impl std::error::Error for EntityValidationError {}
