import { Sequelize } from "sequelize-typescript";
import OrderModel from "../repository/order.model";
import ProductStoreModel from "../../store-catalog/repository/product.model";
import ProductOrder from "../repository/product.order.model";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import ClientOrder from "../repository/client.order.model";
import TransactionModel from "../../payment/repository/transaction.model";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";
import { ClientModel } from "../../client-adm/repository/client.model";
import InvoiceItemModel from "../../invoce/repository/invoice-item.model";
import InvoiceModel from "../../invoce/repository/invoice.model";
import ProductAdmFacadeFactory from "../../produtc-adm/factory/facade.factory";
import CheckoutFacadeFactory from "../factory/facade.factory";
import ProductModel from "../../produtc-adm/repository/product.model";
import { Umzug } from "umzug";
import { migrator } from "../../@shared/config-migrations/migrator";

describe("client adm facade test unit", () => {
  let sequelize: Sequelize;
  let migration: Umzug<any>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([
      OrderModel,
      ProductOrder,
      ClientOrder,
      ProductModel,
      ProductStoreModel,
      TransactionModel,
      ClientModel,
      InvoiceItemModel,
      InvoiceModel,
    ]);

    migration = migrator(sequelize);
    await migration.up();
  });

  afterEach(async () => {
    if (!migration || !sequelize) {
      return;
    }
    migration = migrator(sequelize);
    await migration.down();
    await sequelize.close();
  });

  it("should not add an order", async () => {
    const clientUsecase = ClientAdmFacadeFactory.create();
    const input = {
      id: "1c",
      name: "nome",
      document: "doc",
      email: "x@doc.com",
      street: "street",
      number: "2",
      city: "city",
      zipCode: "zipcode",
      state: "state",
      complement: "complement",
    };
    await clientUsecase.add(input);
    const client = await clientUsecase.find({ id: "1c" });

    const productFacade = ProductAdmFacadeFactory.create();
    const inputProduct = {
      id: "1",
      name: "product 1",
      description: "product description",
      purchasePrice: 1,
      stock: 10,
    };
    await productFacade.addProduct(inputProduct);
    const findProductUseCase = StoreCatalogFacadeFactory.create();

    const useCase = CheckoutFacadeFactory.create();
    const products = await findProductUseCase.findAll();

    const listProduct = products.products.map((p) => {
      return { productId: p.id };
    });
    const result = await useCase.execute({
      clientId: client.id,
      products: listProduct,
    });
    expect(result.id).toBeDefined();
    expect(result.invoiceId).toBe(null);
    expect(result.status).toBe("pending");
    expect(result.products.length).toBe(1);
  });

  it("should add an order", async () => {
    const clientUsecase = ClientAdmFacadeFactory.create();
    const input = {
      id: "2",
      name: "nome2",
      document: "doc",
      email: "x@com.com",
      street: "street",
      number: "2",
      city: "city",
      zipCode: "zipcode",
      state: "state",
      complement: "complement",
    };
    await clientUsecase.add(input);
    const client = await clientUsecase.find({ id: "2" });

    const productUsecase = ProductAdmFacadeFactory.create();
    const inputProduct = {
      id: "p2",
      name: "product 2",
      description: "product description",
      purchasePrice: 1,
      stock: 1,
    };
    await productUsecase.addProduct(inputProduct);

    const findProductUseCase = StoreCatalogFacadeFactory.create();
    const products = await findProductUseCase.findAll();

    const useCase = CheckoutFacadeFactory.create();
    const listProduct = products.products.map((p) => {
      return { productId: p.id };
    });
    const result = await useCase.execute({
      clientId: client.id,
      products: listProduct,
    });
    expect(result.id).toBeDefined();
    expect(result.invoiceId).toBeDefined();
    expect(result.products.length).toBe(1);
  }, 5000000);
});
