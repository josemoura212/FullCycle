import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import AddressDto from "../../domain/value-object/addressdto";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";


export default class PlaceOrderUseCase implements UseCaseInterface{
    
  private _clientFacade: ClientAdmFacadeInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacadeInterface;
  private _checkoutGateway: CheckoutGateway;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;


  constructor(clientFacade: ClientAdmFacadeInterface,
      productFacade: ProductAdmFacadeInterface,
      catalogFacade: StoreCatalogFacadeInterface,
      checkoutGateway: CheckoutGateway,
      invoiceFacade: InvoiceFacadeInterface,
      paymentFacade: PaymentFacadeInterface){
      this._clientFacade = clientFacade;
      this._productFacade = productFacade;
      this._catalogFacade = catalogFacade;
      this._checkoutGateway = checkoutGateway;
      this._invoiceFacade = invoiceFacade;
      this._paymentFacade = paymentFacade;

  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {

      const client = await this._clientFacade.find({id: input.clientId})
      if(!client){
          throw new Error('Client not found')
      }

      await this.validateProducts(input);

      const products = await Promise.all(
          input.products.map((p) => this.getProduct(p.productId))
      );
      
      const address = new AddressDto(client.address.street, client.address.number, client.address.city, client.address.zipCode, client.address.state, client.address.complement);
      const myClient = new Client({
          id: new Id(client.id),
          name: client.name,
          email: client.email,
          document: client.document,
          address: address
      })

      const order = new Order({client: myClient, products: products})
      const payment = await this._paymentFacade.process({orderId: order.id.id, amount: order.total})
      const items = products.map((p) => { return { id: null, name: p.name, price: p.salesPrice}})

      const invoiceInputDto = {
          name: client.name,
          document: client.document,
          street: client.address.street,
          number: client.address.number,
          complement: client.address.complement,
          city: client.address.city,
          state: client.address.state,
          zipCode: client.address.zipCode,
          items: items
      }
    try{
      const invoice = payment.status === 'approved' ? await this._invoiceFacade.create(invoiceInputDto) : null;

      payment.status === 'approved' && order.approved();
      await this._checkoutGateway.addOrder(order);

      return {
          id: order.id.id,
          invoiceId: payment.status === 'approved' ? invoice.id : null,
          status: order.status, 
          total: order.total,
          products: order.products.map((p) => { return {productId: p.id.id}})
      }
    } catch (error) {
        console.error('Erro ao criar invoice:', error);
        throw error;
}
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void>{
      if(input.products.length === 0 ){
          throw new Error('No products selected')
      }

      for(const p of input.products){
          const product = await this._productFacade.checkStock({productId: p.productId});
          if( product.stock <= 0){
              throw new Error('Product 1 is not available in stock')
          }
      }
  }

  private async getProduct(productId: string): Promise<Product>{
      const product = await this._catalogFacade.find({id: productId});
      if(!product){
          throw new Error('Product not found')
      }
      return new Product({
          id: new Id(product.id),
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice
      })
  }
  
}