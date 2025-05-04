#[cfg(test)]
mod tests {
    use catalog_rust::catalog_domain::Category;
    use rstest::rstest;

    use crate::domain::entity::category::category_test_fixture::*;

    #[rstest]
    #[case(Some(false))]
    #[case(Some(true))]
    fn test_catalog_creation(#[case] is_active: Option<bool>) {
        use catalog_rust::catalog_domain::Category;
        use chrono::Utc;

        let datetime_before = Utc::now();

        let valid_category = category_fixture();

        let catalog = Category::new(
            valid_category.name.clone(),
            valid_category.description.clone(),
            is_active,
        )
        .unwrap();

        let datetime_after = Utc::now();
        assert!(catalog.id.is_nil() == false);
        assert!(catalog.created_at >= datetime_before);
        assert!(catalog.created_at <= datetime_after);
        assert_eq!(catalog.name, valid_category.name);
        assert_eq!(catalog.description, valid_category.description);
        assert_eq!(catalog.is_active, is_active.unwrap_or(true));
    }

    #[rstest]
    #[case("")]
    #[case("  ")]
    fn instantiate_error_name_is_empty(#[case] name: &str) {
        let valid_category = category_fixture();
        let result = Category::new(name.to_string(), valid_category.description, None);

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Name should not be empty or whitespace".to_string())
        );
    }

    #[rstest]
    #[case("ab")]
    #[case("ac")]
    #[case("aa")]
    fn instantiate_error_name_less_than_3_characters(#[case] name: &str) {
        let valid_category = category_fixture();
        let result = Category::new(name.to_string(), valid_category.description, None);

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Name should be at least 3 characters long".to_string())
        );
    }

    #[test]
    fn instantiate_error_name_greater_than_255_characters() {
        let name = "a".repeat(256);
        let valid_category = category_fixture();
        let result = Category::new(name, valid_category.description, None);

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Name should be less or equal 255 characters long".to_string())
        );
    }

    #[test]
    fn instantiate_error_description_greater_than_10_000_characters() {
        let description = "a".repeat(10_001);
        let valid_category = category_fixture();
        let result = Category::new(valid_category.name, description, None);

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Description should be less or equal 10000 characters long".to_string())
        );
    }

    #[test]
    fn update_valid() {
        let valid_category = category_fixture();
        let mut catalog =
            Category::new(valid_category.name, valid_category.description, None).unwrap();
        let result = catalog.update("New name".to_string(), Some("New description".to_string()));

        assert!(result.is_ok());
        assert_eq!(catalog.name, "New name");
        assert_eq!(catalog.description, "New description");
    }

    #[test]
    fn update_only_name() {
        let valid_category = category_fixture();
        let mut catalog =
            Category::new(valid_category.name, valid_category.description, None).unwrap();
        let result = catalog.update("New name".to_string(), None);

        assert!(result.is_ok());
        assert_eq!(catalog.name, "New name");
    }

    #[test]
    fn update_only_description() {
        let valid_category = category_fixture();
        let mut catalog = Category::new(
            valid_category.name.clone(),
            valid_category.description,
            None,
        )
        .unwrap();
        let result = catalog.update(
            valid_category.name.clone(),
            Some("New description".to_string()),
        );

        assert!(result.is_ok());
        assert_eq!(catalog.name, valid_category.name);
        assert_eq!(catalog.description, "New description");
    }

    #[test]
    fn update_preserves_description_when_none() {
        let valid_category = category_fixture();
        let mut catalog = Category::new(
            valid_category.name.clone(),
            valid_category.description.clone(),
            None,
        )
        .unwrap();

        let result = catalog.update("Updated name".to_string(), None);

        assert!(result.is_ok());
        assert_eq!(catalog.name, "Updated name");
        assert_eq!(catalog.description, valid_category.description);
    }

    #[test]
    fn exception_fallback_message_none() {
        use catalog_rust::catalog_domain::EntityValidationException;
        use std::fmt::Write;

        let err = EntityValidationException::new(None);
        let mut output = String::new();
        let _ = write!(&mut output, "{}", err);
        assert_eq!(output, "Entity validation error");

        let debug_output = format!("{:?}", err);
        assert_eq!(debug_output, "EntityValidationException: None");
    }

    #[rstest]
    #[case("")]
    #[case("  ")]
    fn update_error_name_is_empty(#[case] name: &str) {
        let valid_category = category_fixture();
        let mut catalog =
            Category::new(valid_category.name, valid_category.description, None).unwrap();
        let result = catalog.update(name.to_string(), None);

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Name should not be empty or whitespace".to_string())
        );
    }

    #[rstest]
    #[case("ab")]
    #[case("ac")]
    #[case("aa")]
    fn update_error_name_less_than_3_characters(#[case] name: &str) {
        let valid_category = category_fixture();
        let mut catalog =
            Category::new(valid_category.name, valid_category.description, None).unwrap();

        let result = catalog.update(name.to_string(), None);

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Name should be at least 3 characters long".to_string())
        );
    }

    #[test]
    fn activate() {
        let valid_category = category_fixture();
        let mut catalog =
            Category::new(valid_category.name, valid_category.description, Some(false)).unwrap();
        let result = catalog.activate();

        assert!(result.is_ok());
        assert_eq!(catalog.is_active, true);
    }

    #[test]
    fn deactivate() {
        let valid_category = category_fixture();
        let mut catalog =
            Category::new(valid_category.name, valid_category.description, Some(true)).unwrap();
        let result = catalog.deactivate();

        assert!(result.is_ok());
        assert_eq!(catalog.is_active, false);
    }

    #[test]
    fn update_error_name_greater_than_255_characters() {
        let valid_category = category_fixture();
        let mut catalog =
            Category::new(valid_category.name, valid_category.description, None).unwrap();
        let name = "a".repeat(256);
        let result = catalog.update(name, None);

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Name should be less or equal 255 characters long".to_string())
        );
    }

    #[test]
    fn update_error_description_greater_than_10_000_characters() {
        let valid_category = category_fixture();
        let mut catalog =
            Category::new(valid_category.name, valid_category.description, None).unwrap();
        let description = "a".repeat(10_001);
        let result = catalog.update("Valid name".to_string(), Some(description));

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Description should be less or equal 10000 characters long".to_string())
        );
    }
}
