import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import CheckoutFacadeInterface, { CheckoutFacadeInputDto, CheckoutFacadeOutputDto } from "./checkout.facade.interface";

export default class CheckoutFacade implements CheckoutFacadeInterface{
    
  private _addCheckout: UseCaseInterface;

  constructor(_addCheckout: UseCaseInterface){
      this._addCheckout = _addCheckout;
  }

  execute(input: CheckoutFacadeInputDto): Promise<CheckoutFacadeOutputDto> {
      return this._addCheckout.execute(input);
  }
}
