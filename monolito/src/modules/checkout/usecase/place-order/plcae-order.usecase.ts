import { or } from "sequelize";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadaInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoce/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/payment.facade.interfaec";
import ProductAdmFacadeInterface from "../../../produtc-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";
import Address from "../../../@shared/domain/value-object/address.value-object";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadaInterface;
  private _productFacade: ProductAdmFacadeInterface;
  private _catalogFacade: StoreCatalogFacadeInterface;
  private _repository: CheckoutGateway;
  private _invoiceFacade: InvoiceFacadeInterface;
  private _paymentFacade: PaymentFacadeInterface;

  constructor(
    clientFacade: ClientAdmFacadaInterface,
    productFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface,
    repository: CheckoutGateway,
    invoiceFacade: InvoiceFacadeInterface,
    paymentFacade: PaymentFacadeInterface
  ) {
    this._clientFacade = clientFacade;
    this._productFacade = productFacade;
    this._catalogFacade = catalogFacade;
    this._repository = repository;
    this._invoiceFacade = invoiceFacade;
    this._paymentFacade = paymentFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    //* buscar o cliente. caso nao encontrar -> client not found
    const client = await this._clientFacade.find({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }

    //* valida produto // funcao a parte
    await this.validateProducts(input);

    //* recuperar produtos
    const products = await Promise.all(
      input.products.map((p) => this.getProduct(p.productId))
    );

    //* criar o objeto do client

    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: client.street,
    });

    //* criaro objeto do order (client,products)
    const order = new Order({
      client: myClient,
      products,
    });

    //* processpayment->paymentfacade.process (orderId,amount)
    const payment = await this._paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });

    //* caso pagamento seja aprovado. -> Gerar invoice
    const invoice =
      payment.status === "approved"
        ? await this._invoiceFacade.generate({
            name: client.name,
            document: client.document,
            street: client.street,
            number: client.number,
            complement: client.complement,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            items: products.map((p) => ({
              id: p.id.id,
              name: p.name,
              price: p.salesPrice,
            })),
          })
        : null;

    //* mudar o status do order para approved
    payment.status === "approved" && order.approve();

    //* salvar o order
    await this._repository.addOrder(order);

    //* retorna dto
    return {
      id: order.id.id,
      invoiceId: payment.status === "approved" ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: order.products.map((p) => ({
        productId: p.id.id,
      })),
    };
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({
        productId: p.productId,
      });
      if (product.stock <= 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock`
        );
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._catalogFacade.find({ id: productId });
    if (!product) {
      throw new Error("Product not found");
    }
    return new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });
  }
}
