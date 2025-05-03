using Catalog.Domain.Exceptions;
using FluentAssertions;
using DomainEntity = Catalog.Domain.Entity;

namespace Catalog.UnitTests.Domain.Entity.Category;

[Collection(nameof(CategoryTestFixture))]
public class CategoryTest(CategoryTestFixture categoryTestFixture)
{
    [Fact(DisplayName = nameof(Instantiate))]
    [Trait("Domain", "Category - Aggregates")]
    public void Instantiate()
    {
        var validCategory = categoryTestFixture.GetValidCategory();

        var datetimeBefore = DateTime.Now;
        Thread.Sleep(100);

        var category = new DomainEntity.Category(validCategory.Name, validCategory.Description);
        var datetimeAfter = DateTime.Now.AddMilliseconds(100);

        category.Should().NotBeNull();
        category.Name.Should().Be(validCategory.Name);
        category.Description.Should().Be(validCategory.Description);
        category.Id.Should().NotBeEmpty();
        category.CreatedAt.Should().NotBeSameDateAs(default(DateTime));
        category.CreatedAt.Should().BeAfter(datetimeBefore);
        category.CreatedAt.Should().BeBefore(datetimeAfter);
        category.IsActive.Should().BeTrue();
    }

    [Theory(DisplayName = nameof(InstantiateWithIsActive))]
    [Trait("Domain", "Category - Aggregates")]
    [InlineData(true)]
    [InlineData(false)]
    public void InstantiateWithIsActive(bool isActive)
    {
        var validCategory = categoryTestFixture.GetValidCategory();

        var datetimeBefore = DateTime.Now;

        var category = new DomainEntity.Category(validCategory.Name, validCategory.Description, isActive);

        var datetimeAfter = DateTime.Now.AddMilliseconds(100);

        category.Should().NotBeNull();
        category.Name.Should().Be(validCategory.Name);
        category.Description.Should().Be(validCategory.Description);
        category.Id.Should().NotBeEmpty();
        category.CreatedAt.Should().NotBeSameDateAs(default(DateTime));
        category.CreatedAt.Should().BeAfter(datetimeBefore);
        category.CreatedAt.Should().BeBefore(datetimeAfter);
        category.IsActive.Should().Be(isActive);
    }

    [Theory(DisplayName = nameof(InstantiateErrorWhenNameIsEmpty))]
    [Trait("Domain", "Category - Aggregates")]
    [InlineData("")]
    [InlineData(null)]
    [InlineData("   ")]
    public void InstantiateErrorWhenNameIsEmpty(string? name)
    {
        var validCategory = categoryTestFixture.GetValidCategory();
        Action action = () => new DomainEntity.Category(name!, validCategory.Description);
        action.Should().Throw<EntityValidationException>().WithMessage("Name should not be empty or null");
    }

    [Fact(DisplayName = nameof(InstantiateErrorWhenDescriptionIsNull))]
    [Trait("Domain", "Category - Aggregates")]
    public void InstantiateErrorWhenDescriptionIsNull()
    {
        var validCategory = categoryTestFixture.GetValidCategory();
        Action action = () => new DomainEntity.Category(validCategory.Name, null!);
        action.Should().Throw<EntityValidationException>().WithMessage("Description should not be null");
    }


    // nome deve ter no mínimo 3 caracteres
    [Theory(DisplayName = nameof(InstantiateErrorWhenNameLessThan3Characters))]
    [Trait("Domain", "Category - Aggregates")]
    [MemberData(nameof(GetNamesWithLessThan3Characters), parameters: 10)]
    public void InstantiateErrorWhenNameLessThan3Characters(string invalidName)
    {
        var validCategory = categoryTestFixture.GetValidCategory();
        Action action = () => new DomainEntity.Category(invalidName, validCategory.Description);
        action.Should().Throw<EntityValidationException>().WithMessage("Name should be at least 3 characters long");
    }

    public static IEnumerable<object[]> GetNamesWithLessThan3Characters(int numberOfTests = 6)
    {
        var fixture = new CategoryTestFixture();
        for (var i = 0; i < numberOfTests; i++)
        {
            var isOdd = i % 2 == 1;
            yield return [fixture.GetValidCategoryName()[..(isOdd ? 1 : 2)]];
        }
    }

    // nome deve ter no máximo 255 caracteres
    [Fact(DisplayName = nameof(InstantiateErrorWhenNameIsGreaterThan255Characters))]
    [Trait("Domain", "Category - Aggregates")]
    public void InstantiateErrorWhenNameIsGreaterThan255Characters()
    {
        var validCategory = categoryTestFixture.GetValidCategory();
        var longString = categoryTestFixture.Faker.Lorem.Letter(256);
        Action action = () => new DomainEntity.Category(longString, validCategory.Description);
        action.Should().Throw<EntityValidationException>()
            .WithMessage("Name should be less or equal 255  characters long");
    }

    // descrição deve ter no máximo 10_000 caracteres
    [Fact(DisplayName = nameof(InstantiateErrorWhenDescriptionIsGreaterThan10_000Characters))]
    [Trait("Domain", "Category - Aggregates")]
    public void InstantiateErrorWhenDescriptionIsGreaterThan10_000Characters()
    {
        var validCategory = categoryTestFixture.GetValidCategory();

        var longString = categoryTestFixture.Faker.Commerce.ProductDescription();
        while (longString.Length <= 10_000)
            longString = $"{longString} {categoryTestFixture.Faker.Commerce.ProductDescription()}";

        Action action = () => new DomainEntity.Category(validCategory.Name, longString);
        action.Should().Throw<EntityValidationException>()
            .WithMessage("Description should be less or equal 10.000 characters long");
    }

    [Fact(DisplayName = nameof(Activate))]
    [Trait("Domain", "Category - Aggregates")]
    public void Activate()
    {
        var validCategory = categoryTestFixture.GetValidCategory();
        var category = new DomainEntity.Category(validCategory.Name, validCategory.Description);
        category.Activate();

        category.IsActive.Should().BeTrue();
    }

    [Fact(DisplayName = nameof(Deactivate))]
    [Trait("Domain", "Category - Aggregates")]
    public void Deactivate()
    {
        var validCategory = categoryTestFixture.GetValidCategory();
        var category = new DomainEntity.Category(validCategory.Name, validCategory.Description);

        category.Deactivate();

        category.IsActive.Should().BeFalse();
    }

    [Fact(DisplayName = nameof(Update))]
    [Trait("Domain", "Category - Aggregates")]
    public void Update()
    {
        var validCategory = categoryTestFixture.GetValidCategory();
        var categoryNewValues = categoryTestFixture.GetValidCategory();

        var category = new DomainEntity.Category(validCategory.Name, validCategory.Description);
        category.Update(categoryNewValues.Name, categoryNewValues.Description);

        category.Name.Should().Be(categoryNewValues.Name);
        category.Description.Should().Be(categoryNewValues.Description);
    }

    [Fact(DisplayName = nameof(UpdateOnlyName))]
    [Trait("Domain", "Category - Aggregates")]
    public void UpdateOnlyName()
    {
        const string description = "category description";
        var validCategory = categoryTestFixture.GetValidCategory();
        var newName = categoryTestFixture.GetValidCategoryName();

        var category = new DomainEntity.Category(validCategory.Name, description);
        category.Update(newName);

        category.Name.Should().Be(newName);
        category.Description.Should().Be(description);
    }

    [Theory(DisplayName = nameof(UpdateErrorWhenNameIsEmpty))]
    [Trait("Domain", "Category - Aggregates")]
    [InlineData("")]
    [InlineData(null)]
    [InlineData("   ")]
    public void UpdateErrorWhenNameIsEmpty(string? name)
    {
        var validCategory = categoryTestFixture.GetValidCategory();
        var category = new DomainEntity.Category(validCategory.Name, validCategory.Description);

        Action action = () => category.Update(name!, "description");
        action.Should().Throw<EntityValidationException>().WithMessage("Name should not be empty or null");
    }

    [Theory(DisplayName = nameof(UpdateErrorWhenNameLessThan3Characters))]
    [Trait("Domain", "Category - Aggregates")]
    [MemberData(nameof(GetNamesWithLessThan3Characters), parameters: 10)]
    public void UpdateErrorWhenNameLessThan3Characters(string invalidName)
    {
        var validCategory = categoryTestFixture.GetValidCategory();
        var category = new DomainEntity.Category(validCategory.Name, validCategory.Description);

        Action action = () => category.Update(invalidName, "description");
        action.Should().Throw<EntityValidationException>().WithMessage("Name should be at least 3 characters long");
    }

    [Fact(DisplayName = nameof(UpdateErrorWhenNameIsGreaterThan255Characters))]
    [Trait("Domain", "Category - Aggregates")]
    public void UpdateErrorWhenNameIsGreaterThan255Characters()
    {
        var validCategory = categoryTestFixture.GetValidCategory();
        var category = new DomainEntity.Category(validCategory.Name, validCategory.Description);
        var longString = categoryTestFixture.Faker.Lorem.Letter(256);

        Action action = () => category.Update(longString, "description");
        action.Should().Throw<EntityValidationException>()
            .WithMessage("Name should be less or equal 255  characters long");
    }

    [Fact(DisplayName = nameof(UpdateErrorWhenDescriptionIsGreaterThan10_000Characters))]
    [Trait("Domain", "Category - Aggregates")]
    public void UpdateErrorWhenDescriptionIsGreaterThan10_000Characters()
    {
        var validCategory = categoryTestFixture.GetValidCategory();
        var category = new DomainEntity.Category(validCategory.Name, validCategory.Description);

        var longString = categoryTestFixture.Faker.Commerce.ProductDescription();
        while (longString.Length <= 10_000)
            longString = $"{longString} {categoryTestFixture.Faker.Commerce.ProductDescription()}";

        Action action = () => category.Update(category.Name, longString);
        action.Should().Throw<EntityValidationException>()
            .WithMessage("Description should be less or equal 10.000 characters long");
    }
}