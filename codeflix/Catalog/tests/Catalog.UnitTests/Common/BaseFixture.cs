using Bogus;

namespace Catalog.UnitTests.Common;

public abstract class BaseFixture
{
    public Faker Faker { get; set; } = new("pt_BR");
}