#[cfg(test)]
mod tests {
    use catalog_rust::category_domain::Category;
    use rstest::rstest;

    #[rstest]
    #[case("Test Catalog", "This is a test catalog", None)]
    #[case("Another Catalog", "Another description", Some(false))]
    fn test_catalog_creation(
        #[case] name: &str,
        #[case] description: &str,
        #[case] is_active: Option<bool>,
    ) {
        use catalog_rust::category_domain::Category;
        use chrono::Utc;
        let datetime_before = Utc::now();

        let catalog = Category::new(name.to_string(), description.to_string(), is_active).unwrap();
        let datetime_after = Utc::now();
        assert!(catalog.id.is_nil() == false);
        assert!(catalog.created_at >= datetime_before);
        assert!(catalog.created_at <= datetime_after);
        assert_eq!(catalog.name, name);
        assert_eq!(catalog.description, description);
        assert_eq!(catalog.is_active, is_active.unwrap_or(true));
    }

    #[rstest]
    #[case("")]
    #[case("  ")]
    fn instantiate_error_name_is_empty(#[case] name: &str) {
        let result = Category::new(name.to_string(), "Valid description".to_string(), None);

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Name cannot be empty or whitespace".to_string())
        );
    }

    #[rstest]
    #[case("ab")]
    #[case("ac")]
    #[case("aa")]
    fn instantiate_error_name_less_than_3_characters(#[case] name: &str) {
        let result = Category::new(name.to_string(), "Valid description".to_string(), None);

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Name must be at least 3 characters long".to_string())
        );
    }

    #[test]
    fn instantiate_error_name_greater_than_255_characters() {
        let name = "a".repeat(256);
        let result = Category::new(name, "Valid description".to_string(), None);

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Name should be less or equal 255  characters long".to_string())
        );
    }

    #[test]
    fn instantiate_error_description_greater_than_10_000_characters() {
        let description = "a".repeat(10_001);
        let result = Category::new("Valid name".to_string(), description, None);

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Description should be less or equal 10.000 characters long".to_string())
        );
    }

    #[test]
    fn update_valid() {
        let mut catalog = Category::new(
            "Valid name".to_string(),
            "Valid description".to_string(),
            None,
        )
        .unwrap();
        let result = catalog.update("New name".to_string(), Some("New description".to_string()));

        assert!(result.is_ok());
        assert_eq!(catalog.name, "New name");
        assert_eq!(catalog.description, "New description");
    }

    #[test]
    fn update_only_name() {
        let mut catalog = Category::new(
            "Valid name".to_string(),
            "Valid description".to_string(),
            None,
        )
        .unwrap();
        let result = catalog.update("New name".to_string(), None);

        assert!(result.is_ok());
        assert_eq!(catalog.name, "New name");
    }

    #[rstest]
    #[case("")]
    #[case("  ")]
    fn update_error_name_is_empty(#[case] name: &str) {
        let mut catalog = Category::new(
            "Valid name".to_string(),
            "Valid description".to_string(),
            None,
        )
        .unwrap();
        let result = catalog.update(name.to_string(), None);

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Name cannot be empty or whitespace".to_string())
        );
    }

    #[rstest]
    #[case("ab")]
    #[case("ac")]
    #[case("aa")]
    fn update_error_name_less_than_3_characters(#[case] name: &str) {
        let mut catalog = Category::new(
            "Valid name".to_string(),
            "Valid description".to_string(),
            None,
        )
        .unwrap();
        let result = catalog.update(name.to_string(), None);

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Name must be at least 3 characters long".to_string())
        );
    }

    #[test]
    fn activate() {
        let mut catalog = Category::new(
            "Valid name".to_string(),
            "Valid description".to_string(),
            Some(false),
        )
        .unwrap();
        let result = catalog.activate();

        assert!(result.is_ok());
        assert_eq!(catalog.is_active, true);
    }

    #[test]
    fn deactivate() {
        let mut catalog = Category::new(
            "Valid name".to_string(),
            "Valid description".to_string(),
            Some(true),
        )
        .unwrap();
        let result = catalog.deactivate();

        assert!(result.is_ok());
        assert_eq!(catalog.is_active, false);
    }

    #[test]
    fn update_error_name_greater_than_255_characters() {
        let mut catalog = Category::new(
            "Valid name".to_string(),
            "Valid description".to_string(),
            None,
        )
        .unwrap();
        let name = "a".repeat(256);
        let result = catalog.update(name, None);

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Name should be less or equal 255  characters long".to_string())
        );
    }

    #[test]
    fn update_error_description_greater_than_10_000_characters() {
        let mut catalog = Category::new(
            "Valid name".to_string(),
            "Valid description".to_string(),
            None,
        )
        .unwrap();
        let description = "a".repeat(10_001);
        let result = catalog.update("Valid name".to_string(), Some(description));

        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().message,
            Some("Description should be less or equal 10.000 characters long".to_string())
        );
    }
}
