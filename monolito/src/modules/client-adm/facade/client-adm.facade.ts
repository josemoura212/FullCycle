import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import ClientAdmFacadaInterface, {
  AddClientFacadeInputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./client-adm.facade.interface";

export interface UsecaseProps {
  findUsecase: UseCaseInterface;
  addUsecase: UseCaseInterface;
}

export default class ClientAdmFacade implements ClientAdmFacadaInterface {
  private _addUsecase: UseCaseInterface;
  private _findUsecase: UseCaseInterface;

  constructor(usecaseProps: UsecaseProps) {
    this._addUsecase = usecaseProps.addUsecase;
    this._findUsecase = usecaseProps.findUsecase;
  }

  async add(input: AddClientFacadeInputDto): Promise<void> {
    return await this._addUsecase.execute(input);
  }
  async find(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    return await this._findUsecase.execute(input);
  }
}
