import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCasesProps {
  create: UseCaseInterface;
  find: UseCaseInterface;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _createUseCase: UseCaseInterface;
  private _findUseCase: UseCaseInterface;

  constructor(useCasesProps: UseCasesProps) {
      this._createUseCase = useCasesProps.create;
      this._findUseCase = useCasesProps.find;
  }
  
  async create(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
      return this._createUseCase.execute(input)
  }

  async find(id: string): Promise<FindInvoiceFacadeOutputDTO> {
      return this._findUseCase.execute({id: id});
  }

}