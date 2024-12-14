import Invoce from "../domain/invoce";

export default interface InvoceGateway {
  find(id: string): Promise<Invoce>;
}
