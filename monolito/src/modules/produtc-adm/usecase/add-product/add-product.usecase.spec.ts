const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add Product usecase unit test", () => {
  it("should add a product", async () => {
    const productRepository = MockRepository();
    const usecase = new AddProductUseCase(productRepository);

    const input = {
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
    };

    usecase.execute(input);
    // output
  });
});
