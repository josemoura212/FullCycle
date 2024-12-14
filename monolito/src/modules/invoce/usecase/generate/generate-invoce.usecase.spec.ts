import Address from "../../../@shared/domain/value-object/address.value-object";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoce from "../../domain/invoce";
import InvoiceItem from "../../domain/invoce-item";
import GenerateInvoiceUseCase from "./generate-invoce.usecase";

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
    find: jest.fn(),
    generate: jest.fn().mockResolvedValue(Promise.resolve(invoce)),
  };
};

describe("Generate Invoce usecase unit test", () => {
  it("should generate invoce", async () => {
    const invoceRepository = MockRepository();
    const generateInvoceUsecase = new GenerateInvoiceUseCase(invoceRepository);

    const input = {
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
      ],
    };

    const result = await generateInvoceUsecase.execute(input);

    expect(invoceRepository.generate).toHaveBeenCalled();
    expect(result.id).toBe("1");
    expect(result.name).toBe("Test");
    expect(result.document).toBe("123456789");
    expect(result.street).toBe("Rua Teste");
    expect(result.number).toBe("123");
    expect(result.complement).toBe("Complemento");
    expect(result.city).toBe("Cidade");
    expect(result.state).toBe("Estado");
    expect(result.zipCode).toBe("12345678");

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe("1");
    expect(result.items[0].name).toBe("Item Teste");
    expect(result.items[0].price).toBe(123.45);

    expect(result.total).toBe(123.45);
  });
});
