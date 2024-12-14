import e from "express";
import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoce from "../../domain/invoce";
import InvoiceItem from "../../domain/invoce-item";
import FindInvoiceUseCase from "./find-invoce.usecase";

const invoce = new Invoce({
  id: new Id("1"),
  name: "Test",
  document: "123456789",
  address: new Address({
    street: "Rua Teste",
    number: "123",
    complement: "Complemento",
    city: "Cidade",
    state: "Estado",
    zipCode: "12345678",
  }),
  items: [
    new InvoiceItem({
      id: new Id("1"),
      name: "Item Teste",
      price: 123.45,
    }),
  ],
  createdAt: new Date(),
});

const MockRepository = () => {
  return {
    find: jest.fn().mockResolvedValue(Promise.resolve(invoce)),
    generate: jest.fn(),
  };
};

describe("Find Invoce usecase unit test", () => {
  it("should get invoce by id", async () => {
    const invoceRepository = MockRepository();
    const findInvoceUsecase = new FindInvoiceUseCase(invoceRepository);

    const input = {
      id: "1",
    };

    const response = await findInvoceUsecase.execute(input);

    expect(invoceRepository.find).toHaveBeenCalled();
    expect(response.id).toBe("1");
    expect(response.name).toBe("Test");
    expect(response.document).toBe("123456789");

    expect(response.address.street).toBe("Rua Teste");
    expect(response.address.number).toBe("123");
    expect(response.address.complement).toBe("Complemento");
    expect(response.address.city).toBe("Cidade");
    expect(response.address.state).toBe("Estado");
    expect(response.address.zipCode).toBe("12345678");

    expect(response.items).toHaveLength(1);
    expect(response.items[0].id).toBe("1");
    expect(response.items[0].name).toBe("Item Teste");
    expect(response.items[0].price).toBe(123.45);

    expect(response.createdAt).toEqual(invoce.createdAt);
    expect(response.total).toBe(123.45);
  });
});
