import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./plcae-order.usecase";

const mockDate = new Date(2000, 1, 1);
describe("PlaceOrderUsecase unit test", () => {
  describe("ValidateProducts method", () => {
    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();

    it("Should throw error if no products are selected", async () => {
      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };
      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("No products selected"));
    });

    it("Should throw an error when products is out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) =>
          Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1,
          })
        ),
      };

      //@ts-expect-error - force set productFacade
      placeOrderUseCase["_productFacade"] = mockProductFacade;

      let input: PlaceOrderInputDto = {
        clientId: "0",
        products: [{ productId: "1" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };

      await expect(
        placeOrderUseCase["validateProducts"](input)
      ).rejects.toThrow(new Error("Product 1 is not available in stock"));

      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
    });
  });

  describe("getproducts method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();
    it("Should throw an error when product not found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - force set catalogFacade
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product not found")
      );
    });

    it("Should return a product when found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: "1",
          name: "product",
          description: "product",
          salesPrice: 100,
        }),
      };

      //@ts-expect-error - force set catalogFacade
      placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("1")).resolves.toEqual(
        new Product({
          id: new Id("1"),
          name: "product",
          description: "product",
          salesPrice: 100,
        })
      );

      expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
    });
  });
  describe("execute method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase();
    it("Should throw an error when client not found", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - force set clientFacade
      placeOrderUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = {
        clientId: "0",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrowError(
        new Error("Client not found")
      );
    });

    it("Should thrown an error when products are not valid", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true),
      };

      const mockValidateProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(placeOrderUseCase, "validateProducts")
        //@ts-expect-error - not return never
        .mockRejectedValue(new Error("No products selected"));

      //@ts-expect-error - force set clientFacade
      placeOrderUseCase["_clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrowError(
        new Error("No products selected")
      );
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe("place an order", () => {
    const clientProps = {
      id: "1c",
      name: "client",
      document: "0000",
      email: "client@user.com",
      street: "street",
      number: "0",
      complement: "complement",
      city: "city",
      state: "state",
      zipCode: "000",
    };

    const mockClientFacade = {
      find: jest.fn().mockResolvedValue(clientProps),
    };

    const mockPaymentFacade = {
      process: jest.fn(),
    };

    const mockCheckoutRepository = {
      addOrder: jest.fn(),
    };

    const mockInvoiceFacade = {
      generate: jest.fn().mockResolvedValue({ id: "1i" }),
    };

    const placeOrderUseCase = new PlaceOrderUseCase(
      mockClientFacade as any,
      null,
      null,
      mockCheckoutRepository as any,
      mockInvoiceFacade as any,
      mockPaymentFacade
    );

    const products = {
      "1": {
        id: new Id("1"),
        name: "product",
        description: "product",
        salesPrice: 40,
      },
      "2": {
        id: new Id("2"),
        name: "product 2",
        description: "product 2",
        salesPrice: 30,
      },
    };

    const mockValidateProducts = jest
      //@ts-expect-error - spy on private method
      .spyOn(placeOrderUseCase, "validateProducts")
      //@ts-expect-error - not return never
      .mockResolvedValue(null);

    const mockGetProduct = jest
      //@ts-expect-error - spy on private method
      .spyOn(placeOrderUseCase, "getProduct")
      //@ts-expect-error - not return never
      .mockImplementation((productId: keyof typeof products) => {
        return products[productId];
      });

    it("Should not be approved", async () => {
      mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
        transactionId: "1t",
        orderId: "1o",
        amount: 100,
        status: "error",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const input: PlaceOrderInputDto = {
        clientId: "1c",
        products: [{ productId: "1" }, { productId: "2" }],
      };

      let output = await placeOrderUseCase.execute(input);

      expect(output.invoiceId).toBeNull();
      expect(output.total).toBe(70);
      expect(output.products).toStrictEqual([
        { productId: "1" },
        { productId: "2" },
      ]);

      expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockValidateProducts).toHaveBeenCalledWith(input);
      expect(mockGetProduct).toHaveBeenCalledTimes(2);
      expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
    });

    it("Should be approved", async () => {
      mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
        transactionId: "1t",
        orderId: "1o",
        amount: 100,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const input: PlaceOrderInputDto = {
        clientId: "1c",
        products: [{ productId: "1" }, { productId: "2" }],
      };

      let output = await placeOrderUseCase.execute(input);

      expect(output.invoiceId).toBe("1i");
      expect(output.total).toBe(70);
      expect(output.products).toStrictEqual([
        { productId: "1" },
        { productId: "2" },
      ]);

      expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockGetProduct).toHaveBeenCalledTimes(2);
      expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
      expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
        name: clientProps.name,
        document: clientProps.document,
        street: clientProps.street,
        number: clientProps.number,
        complement: clientProps.complement,
        city: clientProps.city,
        state: clientProps.state,
        zipCode: clientProps.zipCode,
        items: [
          {
            id: products["1"].id.id,
            name: products["1"].name,
            price: products["1"].salesPrice,
          },
          {
            id: products["2"].id.id,
            name: products["2"].name,
            price: products["2"].salesPrice,
          },
        ],
      });
    });
  });
});
