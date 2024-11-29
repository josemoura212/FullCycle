import Product from "../../../domain/product/entity/product";
import UpdateProductUseCase from "./update.product.dto";

const product = new Product("123", "Product 1", 10.0);

const input = {
  id: product.id,
  name: "Product 1 Updated",
  price: 20.0,
};

const MockRepository = () => {
  return {
    create: jest.fn(),
    update: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
  };
};

describe("Unit test for product update use case", () => {
  it("Should update a product", async () => {
    const productRepository = MockRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);

    const output = await productUpdateUseCase.execute(input);

    expect(output).toEqual(input);
  });
});
