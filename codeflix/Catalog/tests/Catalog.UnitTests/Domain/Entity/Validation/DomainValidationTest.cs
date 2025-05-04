using Bogus;
using Catalog.Domain.Exceptions;
using Catalog.Domain.Validation;
using FluentAssertions;

namespace Catalog.UnitTests.Domain.Entity.Validation;

public class DomainValidationTest
{
    private Faker Faker { get; set; } = new Faker("pt_BR");

    [Fact(DisplayName = nameof(NotNullOk))]
    [Trait("Domain", "DomainValidation - Validation")]
    public void NotNullOk()
    {
        var value = Faker.Commerce.ProductName();
        var fieldName = Faker.Commerce.ProductAdjective().Replace(" ","");
        Action action = () => DomainValidation.NotNull(value, fieldName);
        action.Should().NotThrow();
    }

    [Fact(DisplayName = nameof(NotNullThrowWhenNull))]
    [Trait("Domain", "DomainValidation - Validation")]
    public void NotNullThrowWhenNull()
    {
        string value = null!;
        var fieldName = Faker.Commerce.ProductAdjective().Replace(" ", "");
        Action action = () => DomainValidation.NotNull(value, fieldName);
        action.Should().Throw<EntityValidationException>().WithMessage($"{fieldName} should not be null");
    }

    [Theory(DisplayName = nameof(NotNullOrEmptyThrowWhenEmpty))]
    [Trait("Domain", "DomainValidation - Validation")]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void NotNullOrEmptyThrowWhenEmpty(string? target)
    {
        var fieldName = Faker.Commerce.ProductAdjective().Replace(" ", "");
        Action action = () => DomainValidation.NotNullOrEmpty(target, fieldName);
        action.Should().Throw<EntityValidationException>().WithMessage($"{fieldName} should not be null or empty");
    }

    [Fact(DisplayName = nameof(NotNullOrEmptyOk))]
    [Trait("Domain", "DomainValidation - Validation")]
    public void NotNullOrEmptyOk()
    {
        var target = Faker.Commerce.ProductName();
        var fieldName = Faker.Commerce.ProductAdjective().Replace(" ", "");
        Action action = () => DomainValidation.NotNullOrEmpty(target, fieldName);
        action.Should().NotThrow();
    }

    [Theory(DisplayName = nameof(MinLengthThrowWhenLessThan3))]
    [Trait("Domain", "DomainValidation - Validation")]
    [MemberData(nameof(GetValuesSmallerThanMin),parameters: 10)]
    public void MinLengthThrowWhenLessThan3(string target, int minLength)
    {
        var fieldName = Faker.Commerce.ProductAdjective().Replace(" ", "");
        Action action = () => DomainValidation.MinLength(target, minLength, fieldName);
        action.Should().Throw<EntityValidationException>().WithMessage($"{fieldName} should not be less than {minLength} characters long");
    }


    public static IEnumerable<object[]> GetValuesSmallerThanMin(int numberOfTests)
    {
        yield return new object[] { "123456", 10 };
        var faker = new Faker("pt_BR");
        for (int i = 0; i < (numberOfTests - 1); i++)
        {
            var example = faker.Commerce.ProductName();
            var minLength = example.Length + (new Random().Next(1,20));
            yield return new object[] { example, minLength };
        }
    }

    [Theory(DisplayName = nameof(MinLengthOk))]
    [Trait("Domain", "DomainValidation - Validation")]
    [MemberData(nameof(GetValuesGreaterThanMin), parameters: 10)]
    public void MinLengthOk(string target, int minLength)
    {
        var fieldName = Faker.Commerce.ProductAdjective().Replace(" ", "");
        Action action = () => DomainValidation.MinLength(target, minLength, fieldName);
        action.Should().NotThrow();
    }

    public static IEnumerable<object[]> GetValuesGreaterThanMin(int numberOfTests)
    {
        yield return new object[] { "123456", 6 };
        var faker = new Faker("pt_BR");
        for (int i = 0; i < (numberOfTests - 1); i++)
        {
            var example = faker.Commerce.ProductName();
            var minLength = example.Length - (new Random().Next(1, 5));
            yield return new object[] { example, minLength };
        }
    }

    [Theory(DisplayName = nameof(MaxLengthThrowWhenGreaterThan255))]
    [Trait("Domain", "DomainValidation - Validation")]
    [MemberData(nameof(GetValuesGreaterThanMax), parameters: 10)]
    public void MaxLengthThrowWhenGreaterThan255(string target,int maxLength)
    {
        var fieldName = Faker.Commerce.ProductAdjective().Replace(" ", "");
        Action action = () => DomainValidation.MaxLength(target, maxLength, fieldName);
        action.Should().Throw<EntityValidationException>().WithMessage($"{fieldName} should not be greater than {maxLength} characters long");
    }

    public static IEnumerable<object[]> GetValuesGreaterThanMax(int numberOfTests)
    {
        yield return new object[] { "123456", 5 };
        var faker = new Faker("pt_BR");
        for (int i = 0; i < (numberOfTests - 1); i++)
        {
            var example = faker.Commerce.ProductName();
            var maxLength = example.Length - (new Random().Next(1, 5));
            yield return new object[] { example, maxLength };
        }
    }

    [Theory(DisplayName = nameof(MaxLengthOk))]
    [Trait("Domain", "DomainValidation - Validation")]
    [MemberData(nameof(GetValuesLessThanMax), parameters: 10)]
    public void MaxLengthOk(string target, int maxLength)
    {
        var fieldName = Faker.Commerce.ProductAdjective().Replace(" ", "");
        Action action = () => DomainValidation.MaxLength(target, maxLength, fieldName);
        action.Should().NotThrow();
    }

    public static IEnumerable<object[]> GetValuesLessThanMax(int numberOfTests)
    {
        yield return new object[] { "123456", 6 };
        var faker = new Faker("pt_BR");
        for (int i = 0; i < (numberOfTests - 1); i++)
        {
            var example = faker.Commerce.ProductName();
            var maxLength = example.Length + (new Random().Next(0, 5));
            yield return new object[] { example, maxLength };
        }
    }
}