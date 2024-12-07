import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ProductAdmFacadeInterface, {
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
  ProductAdmFacadeInputDto,
} from "./product-adm.facade.interface";

export interface UsecaseProps {
  addUseCase: UseCaseInterface;
  stockUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  private _addUseCase: UseCaseInterface;
  private _checkStockUseCase: UseCaseInterface;

  constructor(usecasesprops: UsecaseProps) {
    this._addUseCase = usecasesprops.addUseCase;
    this._checkStockUseCase = usecasesprops.stockUseCase;
  }
  async addProduct(input: ProductAdmFacadeInputDto): Promise<void> {
    return this._addUseCase.execute(input);
  }

  async checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    return this._checkStockUseCase.execute(input);
  }
}
