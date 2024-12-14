import Invoce from "../domain/invoce";

export default interface InvoiceGateray {
  find(id: string): Promise<Invoce>;
  generate(invoice: Invoce): Promise<Invoce>;
}
