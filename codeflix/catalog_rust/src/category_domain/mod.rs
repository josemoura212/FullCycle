mod entity {
    pub mod category;
}
mod exceptions {
    pub mod entity_validation;
}

pub use entity::category::Category;
pub use exceptions::entity_validation::*;
