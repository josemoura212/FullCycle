import { toXML } from "jstoxml";
import { OutputListCustomerDto } from "../../../usecase/custumer/list/list.customer.dto";

export default class CustomerPresenter {
  static listXML(data: OutputListCustomerDto): string {
    const xmlOption = {
      header: true,
      indent: "  ",
      newline: "\n",
      allowEmpty: true,
    };

    return toXML(
      {
        constumers: {
          customer: data.customers.map((customer) => ({
            name: customer.name,
            address: {
              street: customer.address.street,
              city: customer.address.city,
              number: customer.address.number,
              zip: customer.address.zip,
            },
          })),
        },
      },
      xmlOption
    );
  }
}
