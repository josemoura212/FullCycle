import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoce";
import InvoiceItem from "../domain/invoce-item";
import InvoiceGateray from "../gateway/invoce.gateway";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceModel from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateray {
  async find(id: string): Promise<Invoice> {
    const result = await InvoiceModel.findOne({
      where: { id },
      include: [InvoiceItemModel],
    });

    if (!result) {
      throw new Error(`invoice with id ${id} not found`);
    }

    return new Invoice({
      id: new Id(result.id),
      name: result.name,
      document: result.document,
      address: new Address({
        street: result.street,
        number: result.number,
        complement: result.complement,
        city: result.city,
        state: result.state,
        zipCode: result.zipCode,
      }),
      items: result.items.map((item) => {
        return new InvoiceItem({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        });
      }),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }
  async generate(invoice: Invoice): Promise<Invoice> {
    const result = await InvoiceModel.create(
      {
        id: invoice.id.id,
        name: invoice.name,
        document: invoice.document,
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
        items: invoice.items.map((item) => {
          return {
            id: item.id.id,
            invoiceId: invoice.id.id,
            name: item.name,
            price: item.price,
          };
        }),
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
      {
        include: [InvoiceItemModel],
        returning: true,
      }
    );

    return new Invoice({
      id: new Id(result.id),
      name: result.name,
      document: result.document,
      address: new Address({
        street: result.street,
        number: result.number,
        complement: result.complement,
        city: result.city,
        state: result.state,
        zipCode: result.zipCode,
      }),
      items: result.items.map((item) => {
        return new InvoiceItem({
          id: new Id(item.id),
          name: item.name,
          price: item.price,
        });
      }),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    });
  }
}
