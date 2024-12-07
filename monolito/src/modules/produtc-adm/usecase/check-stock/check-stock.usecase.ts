import {
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from "../../facade/product-adm.facade.interface";
import ProductGateway from "../../gateway/produect.gateway";

export default class CheckStockUsecase {
  private _productRepository: ProductGateway;
  constructor(productRepository: ProductGateway) {
    this._productRepository = productRepository;
  }

  async execute(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    const product = await this._productRepository.find(input.productId);
    return {
      productId: product.id.id,
      stock: product.stock,
    };
  }
}
