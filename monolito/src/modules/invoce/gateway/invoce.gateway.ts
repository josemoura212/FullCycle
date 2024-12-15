import Invoice from "../domain/invoce";

export default interface InvoiceGateray {
  find(id: string): Promise<Invoice>;
  generate(invoice: Invoice): Promise<Invoice>;
}
