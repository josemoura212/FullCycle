import Invoice from "../domain/invoice";

export default interface InvoiceGateway {
  create(invoice: Invoice): Promise<void>;
  find(id: string): Promise<Invoice>;
}