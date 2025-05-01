use rstest::rstest;

#[rstest]
#[case("Test Catalog", "This is a test catalog", None)]
#[case("Another Catalog", "Another description", Some(false))]
fn test_catalog_creation(
    #[case] name: &str,
    #[case] description: &str,
    #[case] is_active: Option<bool>,
) {
    use catalog_rust::catalog_domain::Category;
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

#[test]
fn test_catalog_validation() {
    use catalog_rust::catalog_domain::Category;

    let result = Category::new("".to_string(), "Valid description".to_string(), None);

    assert!(result.is_err());
    assert_eq!(
        result.err().unwrap().message,
        Some("Name cannot be empty or whitespace".to_string())
    );

    let result = Category::new(
        "Valid name".to_string(),
        "Valid description".to_string(),
        Some(false),
    );
    assert!(result.is_ok());

    let result = Category::new(
        "Te".to_string(),
        "Another valid description".to_string(),
        None,
    );
    assert!(result.is_err());
}
