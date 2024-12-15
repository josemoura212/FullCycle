import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, {
  FindInvoiceFacadeInputDTO,
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
} from "./invoice.facade.interface";

export interface UsecaseProps {
  findUseCase: UseCaseInterface;
  generateUseCase: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _findUseCase: UseCaseInterface;
  private _generateUseCase: UseCaseInterface;

  constructor(usecasesprops: UsecaseProps) {
    this._findUseCase = usecasesprops.findUseCase;
    this._generateUseCase = usecasesprops.generateUseCase;
  }

  async find(
    input: FindInvoiceFacadeInputDTO
  ): Promise<FindInvoiceFacadeOutputDTO> {
    return this._findUseCase.execute(input);
  }

  async generate(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    return this._generateUseCase.execute(input);
  }
}
