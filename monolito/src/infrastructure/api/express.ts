import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import OrderModel from "../../modules/checkout/repository/order.model";
import ClientModel from "../../modules/client-adm/repository/client.model";
import ProductModel from "../../modules/product-adm/repository/product.model";
import { checkoutRoute } from "./routes/checkout.route";
import { clientRoute } from "./routes/clients.route";
import { invoiceRoute } from "./routes/invoice.route";
import { productRoute } from "./routes/products.route";
import ProductStoreModel from "../../modules/store-catalog/repository/product.model";
import TransactionModel from "../../modules/payment/repository/transaction.model";
import ClientOrder from "../../modules/checkout/repository/client.order.model";
import InvoiceModel from "../../modules/invoice/repository/transaction.model";
import ProductOrder from "../../modules/checkout/repository/product.order.model";
import InvoiceItemModel from "../../modules/invoice/repository/transaction.item.model";

export const app: Express = express();
app.use(express.json());
app.use("/clients", clientRoute);
app.use('/products', productRoute);
app.use('/checkout', checkoutRoute)
app.use('/invoice', invoiceRoute)

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  await sequelize.addModels([
    ProductModel, 
    ClientModel, 
    ProductStoreModel, 
    TransactionModel,
    OrderModel,
    ClientOrder,
    ProductModel,
    InvoiceModel,
    ProductOrder,
    InvoiceItemModel
    ]);
  await sequelize.sync();
}
setupDb();
