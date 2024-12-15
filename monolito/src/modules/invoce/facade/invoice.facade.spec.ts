import { Sequelize } from "sequelize-typescript";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceModel from "../repository/invoice.model";
import InvoiceFacadeFactory from "../factory/facade.factory";

describe("InvoiceFacade teste", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should generate and find a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const inputCreate = {
      name: "Test",
      document: "123456789",
      street: "Rua Teste",
      number: "123",
      complement: "Complemento",
      city: "Cidade",
      state: "Estado",
      zipCode: "12345678",
      items: [
        {
          id: "1",
          name: "Item Teste",
          price: 123.45,
        },
        {
          id: "2",
          name: "Item Teste 2",
          price: 123.45,
        },
      ],
    };

    const result = await facade.generate(inputCreate);

    const invoiceResult = await facade.find({ id: result.id });

    expect(invoiceResult.id).toBe(result.id);
    expect(invoiceResult.name).toBe(result.name);
    expect(invoiceResult.document).toBe(result.document);
    expect(invoiceResult.address.street).toBe(result.street);
    expect(invoiceResult.address.number).toBe(result.number);
    expect(invoiceResult.address.complement).toBe(result.complement);
    expect(invoiceResult.address.city).toBe(result.city);
    expect(invoiceResult.address.state).toBe(result.state);
    expect(invoiceResult.address.zipCode).toBe(result.zipCode);

    expect(invoiceResult.items.length).toBe(2);
    expect(invoiceResult.items[0].id).toBe(result.items[0].id);
    expect(invoiceResult.items[0].name).toBe(result.items[0].name);
    expect(invoiceResult.items[0].price).toBe(result.items[0].price);
    expect(invoiceResult.items[1].id).toBe(result.items[1].id);
    expect(invoiceResult.items[1].name).toBe(result.items[1].name);
    expect(invoiceResult.items[1].price).toBe(result.items[1].price);

    expect(invoiceResult.total).toBe(246.9);
    expect(invoiceResult.createdAt).toBeDefined();
  });
});
