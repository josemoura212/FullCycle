import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import TransactionRepository from "../repository/transaction.repository";
import PaymentFacadeInterface, {
  PaymentFacadeInputDto,
  PaymentFacadeOutputDto,
} from "./payment.facade.interfaec";

export default class PaymentFacade implements PaymentFacadeInterface {
  constructor(private processPaymentUseCase: UseCaseInterface) {}

  async process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
    return this.processPaymentUseCase.execute(input);
  }
}
