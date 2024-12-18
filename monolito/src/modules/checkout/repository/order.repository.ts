import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import ClientOrder from "./client.order.model";
import OrderModel from "./order.model";
import ProductOrder from "./product.order.model";

export default class OrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<Order> {
    const products = order.products.map((p) => {
      return {
        id: p.id.id,
        name: p.name,
        salesPrice: p.salesPrice,
      };
    });
    try {
      await OrderModel.create(
        {
          id: order.id.id,
          client: {
            id: order.client.id.id,
            name: order.client.name,
            document: order.client.document,
            email: order.client.email,
          },
          products: products,
        },
        {
          include: [ClientOrder, ProductOrder],
        }
      );
    } catch (error) {
      console.log(error);
      throw error;
    }

    const result = await OrderModel.findOne({
      where: { id: order.id.id },
      include: [{ model: ClientOrder }, { model: ProductOrder }],
    });
    const clientBD = result.client;
    const productsBD = result.products;
    const productsRes = productsBD.map((p: ProductOrder) => {
      return new Product({
        id: new Id(p.id),
        name: p.name,
        description: p.description,
        salesPrice: p.salesPrice,
      });
    });
    const client = new Client({
      id: new Id(clientBD.id),
      name: clientBD.name,
      document: clientBD.document,
      email: clientBD.email,
    });
    return new Order({
      id: new Id(result.id),
      client: client,
      products: productsRes,
    });
  }

  async findOrder(id: string): Promise<Order> {
    const result = await OrderModel.findOne({
      where: { id: id },
      include: ["client", "products"],
    });
    const clientBD = result.client;
    const productsBD = result.products;
    const productsRes = productsBD.map((p: ProductOrder) => {
      return new Product({
        id: new Id(p.id),
        name: p.name,
        description: p.description,
        salesPrice: p.salesPrice,
      });
    });
    const client = new Client({
      id: new Id(clientBD.id),
      name: clientBD.name,
      document: clientBD.document,
      email: clientBD.email,
    });
    return new Order({
      id: new Id(result.id),
      client: client,
      products: productsRes,
    });
  }
}
