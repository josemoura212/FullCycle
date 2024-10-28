import CustomerRepository from "../../../infrastructure/customer/repository/sequelize/customer.repository";
import { OutputCreateCustomerDto } from "../create/create.customer.dto";
import { InputUpdateCustomerDto } from "./update.customer.dto";

export default class UpdateCustomerUseCase {
  constructor(private customerRepository: CustomerRepository) {}

  async execute(
    input: InputUpdateCustomerDto
  ): Promise<OutputCreateCustomerDto> {}
}
