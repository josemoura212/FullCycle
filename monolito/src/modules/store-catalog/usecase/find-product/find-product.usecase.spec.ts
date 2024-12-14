import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindProductUseCase from "./find-product.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Description of product 1",
  salesPrice: 100,
});

const MockRepository = () => {
  return {
    findAll: jest.fn(),
    find: jest.fn().mockResolvedValue(Promise.resolve(product)),
  };
};

describe("FindProductUseCase test", () => {
  it("should find a product", async () => {
    const repository = MockRepository();
    const findProductUseCase = new FindProductUseCase(repository);

    const input = {
      id: "1",
    };
    const result = await findProductUseCase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toBe("1");
    expect(result.name).toBe("Product 1");
    expect(result.description).toBe("Description of product 1");
    expect(result.salesPrice).toBe(100);
  });
});
