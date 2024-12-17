import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
  constructor() {}
  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    return {
      id: "1",
      invoiceId: "1",
      status: "pending",
      total: 100,
      products: [{ productId: "1" }],
    };
  }
}
