
using Catalog.Domain.Exceptions;
using static System.String;

namespace Catalog.Domain.Entity;
public class Category
{
   

    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string Description { get; private set; } 
    public DateTime CreatedAt { get; private set; }
    public bool IsActive { get; private set; }


    public Category(string name, string description, bool isActive = true)
    {
        Id = Guid.NewGuid();
        Name = name;
        Description = description;
        CreatedAt = DateTime.Now;
        IsActive = isActive;
        Validate();
    }


    public void Validate()
    {
        if(IsNullOrWhiteSpace(Name))
            throw new EntityValidationException($"{nameof(Name)} should not be empty or null");
        if(Description == null)
            throw new EntityValidationException($"{nameof(Description)} should not be null");
        if(Name.Length < 3)
            throw new EntityValidationException($"{nameof(Name)} should be at least 3 characters long");
    }
}

