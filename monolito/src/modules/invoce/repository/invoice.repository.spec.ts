import { Sequelize } from "sequelize-typescript";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../../@shared/domain/value-object/address.value-object";
import InvoiceItem from "../domain/invoce-item";
import Invoice from "../domain/invoce";
import InvoiceRepository from "./invoice.repository";
import FindInvoiceUseCase from "../usecase/find/find-invoce.usecase";
import GenerateInvoiceUseCase from "../usecase/generate/generate-invoce.usecase";

describe("InvoiceRepository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceItemModel, InvoiceModel]);
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });
  it("should generate and find invoice", async () => {
    const inputCreate = {
      id: "1",
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

    const repository = new InvoiceRepository();
    const usecase = new FindInvoiceUseCase(repository);
    const generateUsecase = new GenerateInvoiceUseCase(repository);
    const result = await generateUsecase.execute(inputCreate);

    const invoiceResult = await usecase.execute({ id: result.id });

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
