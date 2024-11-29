import CreateProductUseCase from "./create.product.usecase";

const input = {
  name: "Product 1",
  price: 100,
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    find: jest.fn(),
  };
};

describe("Unit test create product use case", () => {
  it("should create a product", async () => {
    const repository = MockRepository();
    const createProduct = new CreateProductUseCase(repository);

    const output = await createProduct.execute(input);

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: input.price,
    });
  });

  it("should thrown an error when name is missing", async () => {
    const repository = MockRepository();
    const createProduct = new CreateProductUseCase(repository);

    input.name = "";
    await expect(createProduct.execute(input)).rejects.toThrowError(
      "Name is required"
    );
  });

  it("should thrown an error when price is missing", async () => {
    const repository = MockRepository();
    const createProduct = new CreateProductUseCase(repository);

    input.name = "Product 1";
    input.price = -1;
    await expect(createProduct.execute(input)).rejects.toThrow(
      "Price must be greater than zero"
    );
  });
});
