import { Sequelize } from "sequelize-typescript";
import OrderModel from "../repository/order.model";
import ClientModel from "../../client-adm/repository/client.model";
import InvoiceItemModel from "../../invoice/repository/transaction.item.model";
import InvoiceModel from "../../invoice/repository/transaction.model";
import ProductModel from "../../product-adm/repository/product.model";
import ProductStoreModel from "../../store-catalog/repository/product.model";
import ProductOrder from "../repository/product.order.model";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import CheckoutFacadeFactory from "../factory/checkout.facade.factory";
import ClientOrder from "../repository/client.order.model";
import TransactionModel from "../../payment/repository/transaction.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import AddressClientDto from "../../client-adm/domain/value-object/address-client.dto";
import StoreCatalogFacadeFactory from "../../store-catalog/factory/facade.factory";

describe('client adm facade test unit', () =>{

  let sequelize: Sequelize;

  beforeEach(async () => {
      sequelize = new Sequelize({
          dialect: "sqlite",
          storage: ':memory:',
          logging: false,
          sync: {force: true}
      });
      await sequelize.addModels([
          OrderModel, 
          ProductOrder, 
          ClientOrder,
          ProductModel,
          ProductStoreModel,
          TransactionModel,
          ClientModel,
          InvoiceItemModel,
          InvoiceModel
      ]);
      sequelize.connectionManager.initPools();
      await sequelize.sync();
  });

  afterEach(async () => {
      await sequelize.close();
  });

  it('should not add an order', async () => {
      const clientUsecase = ClientAdmFacadeFactory.create();
      const input = {
          id: new Id('1c'),
          name: 'nome',
          document: 'doc',
          email: 'x@doc.com',
          address: new AddressClientDto('street', '1', 'city', 'zipcode', 'state', 'complement')
      }
      await clientUsecase.add(input);
      const client = await clientUsecase.find({id: '1c'});
      
      const productFacade = ProductAdmFacadeFactory.create();
      const inputProduct = {
          id: '1',
          name: 'product 1',
          description: 'product description',
          purchasePrice: 1,
          stock: 10
      };
      productFacade.addProduct(inputProduct);
      const findProductUseCase = StoreCatalogFacadeFactory.create()
      
      const useCase = CheckoutFacadeFactory.create();
      const products = await findProductUseCase.findAll();

      const listProduct = products.products.map((p) => {
          return { productId: p.id}
      })
      const result = await useCase.execute({clientId: client.id, products: listProduct});
      expect(result.id).toBeDefined();
      expect(result.invoiceId).toBe(null);
      expect(result.status).toBe('pending')
      expect(result.products.length).toBe(1)
  }, 5000000);

  it('should add an order',async () => {
      const clientUsecase = ClientAdmFacadeFactory.create();
      const input = {
          id: new Id('2'),
          name: 'nome2',
          document: 'doc',
          email: 'x@com.com',
          address: new AddressClientDto('street', '2', 'city', 'zipcode', 'state', 'complement')
      }
      await clientUsecase.add(input);
      const client = await clientUsecase.find({id: '2'});
      
      const productUsecase = ProductAdmFacadeFactory.create();
      const inputProduct = {
          id: 'p2',
          name: 'product 2',
          description: 'product description',
          purchasePrice: 1,
          stock: 1
      };
      await productUsecase.addProduct(inputProduct);

      const findProductUseCase = StoreCatalogFacadeFactory.create()
      const products = await findProductUseCase.findAll();

      const useCase = CheckoutFacadeFactory.create();
      const listProduct = products.products.map((p) => {
          return { productId: p.id}
      })
      const result = await useCase.execute({clientId: client.id, products: listProduct});
      expect(result.id).toBeDefined();
      expect(result.invoiceId).toBeDefined();
      expect(result.products.length).toBe(1)
  }, 5000000);
});
