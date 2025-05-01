use std::fmt;

pub struct EntityValidationException {
    pub message: Option<String>,
}

impl EntityValidationException {
    pub fn new(message: Option<String>) -> Self {
        Self { message }
    }
}

impl fmt::Display for EntityValidationException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match &self.message {
            Some(msg) => write!(f, "{}", msg),
            None => write!(f, "Entity validation error"),
        }
    }
}

impl fmt::Debug for EntityValidationException {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "EntityValidationException: {:?}", self.message)
    }
}

impl std::error::Error for EntityValidationException {}
