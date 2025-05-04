mod entity {
    pub mod category;
}
mod exceptions {
    pub mod entity_validation;
}

mod validation {
    pub mod domain_validation;
}

pub use entity::category::Category;
pub use exceptions::entity_validation::*;
pub use validation::domain_validation::DomainValidation;
