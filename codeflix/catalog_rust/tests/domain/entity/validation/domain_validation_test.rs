use catalog_rust::catalog_domain::DomainValidation;
use fake::Fake;
use fake::faker::company::pt_br::{CompanyName, Profession};
use rand::Rng;
use rstest::rstest;

fn get_values_smaller_than_min(n: usize) -> Vec<(String, usize)> {
    let mut data = vec![("123456".to_string(), 10)];
    let mut rng = rand::rng();
    for _ in 1..n {
        let example: String = CompanyName().fake();
        let min_length = example.len() + rng.random_range(1..20);
        data.push((example, min_length));
    }
    data
}

fn get_values_greater_than_min(n: usize) -> Vec<(String, usize)> {
    let mut data = vec![("123456".to_string(), 6)];
    let mut rng = rand::rng();
    for _ in 1..n - 1 {
        let example: String = CompanyName().fake();
        let min_length = if example.len() > 1 {
            example.len() - rng.random_range(1..example.len().min(5))
        } else {
            0
        };
        data.push((example, min_length));
    }
    data
}

fn get_values_greater_than_max(n: usize) -> Vec<(String, usize)> {
    let mut data = vec![("123456".to_string(), 5)];
    let mut rng = rand::rng();
    for _ in 1..n {
        let example: String = CompanyName().fake();
        let max_length = if example.len() > 1 {
            example.len() - rng.random_range(1..example.len().min(5))
        } else {
            0
        };
        data.push((example, max_length));
    }
    data
}

fn get_values_less_than_max(n: usize) -> Vec<(String, usize)> {
    let mut data = vec![("123456".to_string(), 6)];
    let mut rng = rand::rng();
    for _ in 1..n {
        let example: String = CompanyName().fake();
        let max_length = example.len() + rng.random_range(0..5);
        data.push((example, max_length));
    }
    data
}

#[test]
fn not_empty_or_whitespace_ok() {
    let value: String = CompanyName().fake();
    let field_name: String = Profession().fake::<String>().replace(" ", "");
    let result = DomainValidation::not_empty_or_whitespace(&value, &field_name);
    assert!(result.is_ok());
}

#[rstest]
#[case("")]
#[case("   ")]
fn not_empty_or_whitespace_throw_when_empty(#[case] target: &str) {
    let field_name: String = fake::faker::company::pt_br::Profession()
        .fake::<String>()
        .replace(" ", "");
    let result = DomainValidation::not_empty_or_whitespace(target, &field_name);
    assert!(result.is_err());
    assert_eq!(
        result.err().unwrap().to_string(),
        format!("{} should not be empty or whitespace", field_name)
    );
}

#[rstest]
#[case(get_values_smaller_than_min(10))]
fn min_length_throw_when_less_than_3(#[case] inputs: Vec<(String, usize)>) {
    for (target, min_length) in inputs {
        let field_name: String = fake::faker::company::pt_br::Profession()
            .fake::<String>()
            .replace(" ", "");
        let result = DomainValidation::min_length(&target, &field_name, min_length);
        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().to_string(),
            format!(
                "{} should be at least {} characters long",
                field_name, min_length
            )
        );
    }
}

#[rstest]
#[case(get_values_greater_than_min(10))]
fn min_length_ok(#[case] inputs: Vec<(String, usize)>) {
    for (target, min_length) in inputs {
        let field_name: String = Profession().fake::<String>().replace(" ", "");
        let result = DomainValidation::min_length(&target, &field_name, min_length);
        assert!(result.is_ok());
    }
}

#[rstest]
#[case(get_values_greater_than_max(10))]
fn max_length_throw_when_greater_than_max(#[case] inputs: Vec<(String, usize)>) {
    for (target, max_length) in inputs {
        let field_name: String = fake::faker::company::pt_br::Profession()
            .fake::<String>()
            .replace(" ", "");
        let result = DomainValidation::max_length(&target, &field_name, max_length);
        assert!(result.is_err());
        assert_eq!(
            result.err().unwrap().to_string(),
            format!(
                "{} should be less or equal {} characters long",
                field_name, max_length
            )
        );
    }
}

#[rstest]
#[case(get_values_less_than_max(10))]
fn max_length_ok(#[case] inputs: Vec<(String, usize)>) {
    for (target, max_length) in inputs {
        let field_name: String = Profession().fake::<String>().replace(" ", "");
        let result = DomainValidation::max_length(&target, &field_name, max_length);
        assert!(result.is_ok());
    }
}

#[test]
fn instantiate_error_description_greater_than_10_000_characters() {
    let description = "a".repeat(10_001);
    let field_name = "Description";
    let result = DomainValidation::max_length(&description, field_name, 10_000);

    assert!(result.is_err());
    assert_eq!(
        result.err().unwrap().to_string(),
        format!(
            "{} should be less or equal {} characters long",
            field_name, 10_000
        )
    );
}
