use fake::{Fake, faker::lorem::pt_br::Sentence, faker::name::pt_br::Name};
use rstest::*;

#[derive(Debug, Clone)]
pub struct CategoryTestFixture {
    pub name: String,
    pub description: String,
}

impl CategoryTestFixture {
    pub fn new() -> Self {
        Self {
            name: get_valid_category_name(),
            description: get_valid_category_description(),
        }
    }
}

#[fixture]
pub fn category_fixture() -> CategoryTestFixture {
    CategoryTestFixture::new()
}

pub fn get_valid_category_name() -> String {
    let mut name: String = Name().fake();
    while name.len() < 3 || name.len() > 255 {
        name = Name().fake();
    }
    name
}

pub fn get_valid_category_description() -> String {
    let name: String = Sentence(1..50).fake();
    while name.len() > 10_000 {
        return name[..10_000].to_string();
    }
    name
}
