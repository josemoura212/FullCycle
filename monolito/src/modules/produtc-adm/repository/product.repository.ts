import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/produect.gateway";
import ProductModel from "./product.model";

export default class ProductRepository implements ProductGateway {
  async add(product: Product): Promise<void> {
    await ProductModel.create({
      id: product.id.id,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  async find(id: string): Promise<Product> {
    const result = await ProductModel.findOne({
      where: { id },
    });

    if (!result) {
      return null;
    }

    return new Product({
      id: new Id(result.id),
      name: result.name,
      description: result.description,
      purchasePrice: result.purchasePrice,
      stock: result.stock,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }
}
