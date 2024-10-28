import CreateCustomerUseCase from "./create.customer.usecase";

const input = {
  name: "John",
  address: {
    street: "Street",
    number: 123,
    zip: "Zip",
    city: "City 1",
  },
};

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };
};

describe("Unit test create customer use case", () => {
  it("should create a customer", async () => {
    const repository = MockRepository();
    const createCustomer = new CreateCustomerUseCase(repository);

    const output = await createCustomer.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      address: {
        street: input.address.street,
        number: input.address.number,
        zip: input.address.zip,
        city: input.address.city,
      },
    });
  });

  it("should thrown an error when street is missing", async () => {
    const repository = MockRepository();
    const createCustomer = new CreateCustomerUseCase(repository);

    input.address.street = "";
    expect(createCustomer.execute(input)).rejects.toThrowError(
      "Street is required"
    );
  });
});
