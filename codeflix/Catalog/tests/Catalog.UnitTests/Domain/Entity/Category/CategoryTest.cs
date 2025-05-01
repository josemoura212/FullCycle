using Catalog.Domain.Exceptions;
using DomainEntity = Catalog.Domain.Entity;
namespace Catalog.UnitTests.Domain.Entity.Category
{
    public class CategoryTest
    {
        [Fact(DisplayName = nameof(Instantiate))]
        [Trait("Domain", "Category - Aggregates")]
        public void Instantiate()
        {

            var validData = new
            {
                Name = "category name",
                Description = "category description",   
            };

            var datetimeBefore = DateTime.Now;

            var category = new DomainEntity.Category(validData.Name, validData.Description);
            var datetimeAfter = DateTime.Now;

            Assert.NotNull(category);
            Assert.Equal(validData.Name, category.Name);
            Assert.Equal(validData.Description, category.Description);
            Assert.NotEqual(default(Guid), category.Id);
            Assert.NotEqual(default(DateTime), category.CreatedAt);
            Assert.True(category.CreatedAt > datetimeBefore);
            Assert.True(category.CreatedAt < datetimeAfter);
            Assert.True(category.IsActive);
        }

        [Theory(DisplayName = nameof(InstantiateWithIsActive))]
        [Trait("Domain", "Category - Aggregates")]
        [InlineData(true)]
        [InlineData(false)]
        public void InstantiateWithIsActive(bool isActive)
        {

            var validData = new
            {
                Name = "category name",
                Description = "category description",
            };

            var datetimeBefore = DateTime.Now;

            var category = new DomainEntity.Category(validData.Name, validData.Description, isActive);
            var datetimeAfter = DateTime.Now;

            Assert.NotNull(category);
            Assert.Equal(validData.Name, category.Name);
            Assert.Equal(validData.Description, category.Description);
            Assert.NotEqual(default(Guid), category.Id);
            Assert.NotEqual(default(DateTime), category.CreatedAt);
            Assert.True(category.CreatedAt > datetimeBefore);
            Assert.True(category.CreatedAt < datetimeAfter);
            Assert.Equal(category.IsActive, isActive);
        }

        [Theory(DisplayName = nameof(InstantiateErrorWhenNameIsEmpty))]
        [Trait("Domain", "Category - Aggregates")]
        [InlineData("")]
        [InlineData(null)]
        [InlineData("   ")]
        public void InstantiateErrorWhenNameIsEmpty(string? name)
        {
            Action action = () => new DomainEntity.Category(name!, "description", true);
            var exception = Assert.Throws<EntityValidationException>(action);
            Assert.Equal("Name should not be empty or null", exception.Message);
        }

        [Fact(DisplayName = nameof(InstantiateErrorWhenDescriptionIsNull))]
        [Trait("Domain", "Category - Aggregates")]
        public void InstantiateErrorWhenDescriptionIsNull()
        {
            Action action = () => new DomainEntity.Category("Category name", null!, true);
            var exception = Assert.Throws<EntityValidationException>(action);
            Assert.Equal("Description should not be null", exception.Message);
        }


        // nome deve ter nominimo 3 caracteres
        [Theory(DisplayName = nameof(InstantiateErrorWhenNameLessThan3Characters))]
        [Trait("Domain", "Category - Aggregates")]
        [InlineData("ab")]
        [InlineData("a")]
        [InlineData("cc")]
        [InlineData("aa")]
        public void InstantiateErrorWhenNameLessThan3Characters(string invalidName)
        {
            Action action = () => new DomainEntity.Category(invalidName, "description", true);
            var exception = Assert.Throws<EntityValidationException>(action);
            Assert.Equal("Name should be at least 3 characters long", exception.Message);
        }

        // nome deve ter no maximo 255 caracteres
        [Fact(DisplayName = nameof(InstantiateErrorWhenNameIsGreaterThan255Characters))]
        [Trait("Domain", "Category - Aggregates")]
        public void InstantiateErrorWhenNameIsGreaterThan255Characters()
        {
            var longString = new string('a', 256);
            Action action = () => new DomainEntity.Category(longString, "description", true);
            var exception = Assert.Throws<EntityValidationException>(action);
            Assert.Equal("Name should be less or equal 255  characters long", exception.Message);
        }

        // descricao deve ter no maximo 10_000 caracteres
        [Fact(DisplayName = nameof(InstantiateErrorWhenDescriptionIsGreaterThan10_000Characters))]
        [Trait("Domain", "Category - Aggregates")]
        public void InstantiateErrorWhenDescriptionIsGreaterThan10_000Characters()
        {
            var longString = new string('a', 10_001);
            Action action = () => new DomainEntity.Category("name", longString, true);
            var exception = Assert.Throws<EntityValidationException>(action);
            Assert.Equal("Description should be less or equal 10.000 characters long", exception.Message);
        }

        [Fact(DisplayName = nameof(Activate))]
        [Trait("Domain", "Category - Aggregates")]
        public void Activate()
        {

            var validData = new
            {
                Name = "category name",
                Description = "category description",
            };

            var category = new DomainEntity.Category(validData.Name, validData.Description,false);
            category.Activate();

            Assert.True(category.IsActive);
        }

        [Fact(DisplayName = nameof(Deactivate))]
        [Trait("Domain", "Category - Aggregates")]
        public void Deactivate()
        {

            var validData = new
            {
                Name = "category name",
                Description = "category description",
            };

            var category = new DomainEntity.Category(validData.Name, validData.Description);
            category.Deactivate();

            Assert.False(category.IsActive);
        }
    }
}
