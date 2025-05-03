using Catalog.Domain.Exceptions;

namespace Catalog.Domain.Validation;

public class DomainValidation
{
    public static void NotNull<T>(T target, string fieldName)
    {
        if (target == null)
            throw new EntityValidationException($"{fieldName} should not be null");
    }

    public static void NotNullOrEmpty(string? target, string fieldName)
    {
        if (string.IsNullOrWhiteSpace(target))
            throw new EntityValidationException($"{fieldName} should not be null or empty");
    }
}