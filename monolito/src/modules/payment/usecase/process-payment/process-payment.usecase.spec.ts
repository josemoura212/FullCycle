import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase";

const transaction = new Transaction({
  id: new Id("1"),
  orderId: "1",
  amount: 100,
  status: "approved",
});

const MockRepository = () => {
  return {
    save: jest.fn().mockResolvedValue(Promise.resolve(transaction)),
  };
};
const transaction2 = new Transaction({
  id: new Id("1"),
  orderId: "1",
  amount: 50,
  status: "declined",
});

const MockRepositoryDeclined = () => {
  return {
    save: jest.fn().mockResolvedValue(Promise.resolve(transaction2)),
  };
};

describe("ProcessPaymentUseCase unit test", () => {
  it("Should approve a transaction", async () => {
    const paymetnRepository = MockRepository();
    const usecase = new ProcessPaymentUseCase(paymetnRepository);

    const input = {
      orderId: "1",
      amount: 100,
    };

    const result = await usecase.execute(input);

    expect(result.transactionId).toBe(transaction.id.id);
    expect(paymetnRepository.save).toHaveBeenCalled();
    expect(result.status).toBe("approved");
    expect(result.amount).toBe(100);
    expect(result.orderId).toBe("1");
    expect(result.createdAt).toEqual(transaction.createdAt);
    expect(result.updatedAt).toEqual(transaction.updatedAt);
  });

  it("Should decline a transaction", async () => {
    const paymetnRepository = MockRepositoryDeclined();
    const usecase = new ProcessPaymentUseCase(paymetnRepository);

    const input = {
      orderId: "1",
      amount: 50,
    };

    const result = await usecase.execute(input);

    expect(result.transactionId).toBe(transaction2.id.id);
    expect(paymetnRepository.save).toHaveBeenCalled();
    expect(result.status).toBe("declined");
    expect(result.amount).toBe(50);
    expect(result.orderId).toBe("1");
    expect(result.createdAt).toEqual(transaction2.createdAt);
    expect(result.updatedAt).toEqual(transaction2.updatedAt);
  });
});
