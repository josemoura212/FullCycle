import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import OrderRepository from "../repository/order.repository";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

export default class CheckoutFacadeFactory{
  static create(){
      const clientFacade = ClientAdmFacadeFactory.create();
      const productFacade = ProductAdmFacadeFactory.create();
      const storeFacade = StoreCatalogFacadeFactory.create();
      const orderRepository = new OrderRepository();
      const invoice = InvoiceFacadeFactory.create();
      const payment = PaymentFacadeFactory.create();
      const usecase = new PlaceOrderUseCase(
          clientFacade, 
          productFacade, 
          storeFacade, 
          orderRepository,
          invoice,
          payment);
      
      return usecase;
  }
}