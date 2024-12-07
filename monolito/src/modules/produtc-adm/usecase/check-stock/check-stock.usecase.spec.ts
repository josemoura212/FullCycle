import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import CheckStockUsecase from "./check-stock.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Produto 1",
  description: "Descrição do produto 1",
  purchasePrice: 10,
  stock: 10,
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockResolvedValue(Promise.resolve(product)),
  };
};
describe("CheckStock usecase unit test", () => {
  it("should get stock of a product", async () => {
    const productRepository = MockRepository();
    const checkStockUsecase = new CheckStockUsecase(productRepository);
    const input = {
      productId: "1",
    };

    const response = await checkStockUsecase.execute(input);

    expect(productRepository.find).toHaveBeenCalled();
    expect(response.stock).toBe(10);
    expect(response.productId).toBe("1");
  });
});
