mod entity {
    pub mod category;
}
mod error {
    pub mod validation_error;
}

mod validation {
    pub mod domain_validation;
}

pub use entity::category::Category;
pub use error::validation_error::*;
pub use validation::domain_validation::DomainValidation;
