import Customer from "../../../domain/customer/entity/customer";
import CustomerRepositoryInterface from "../../../domain/customer/repository/customer-repository.interface";
import {
  InputListCustomerDtio,
  OutputListCustomerDto,
} from "./list.customer.dto";

export default class ListCustomerUseCase {
  private customerRepository: CustomerRepositoryInterface;
  constructor(customerRepository: CustomerRepositoryInterface) {
    this.customerRepository = customerRepository;
  }

  async execute(input: InputListCustomerDtio): Promise<OutputListCustomerDto> {
    const customers = await this.customerRepository.findAll();
    return OutputMapper.toOutput(customers);
  }
}

class OutputMapper {
  static toOutput(customer: Customer[]): OutputListCustomerDto {
    return {
      customers: customer.map((c) => {
        return {
          id: c.id,
          name: c.name,
          address: {
            street: c.Address.street,
            number: c.Address.number,
            zip: c.Address.zip,
            city: c.Address.city,
          },
        };
      }),
    };
  }
}
