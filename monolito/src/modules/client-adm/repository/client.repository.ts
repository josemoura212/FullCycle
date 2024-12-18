import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import AddressClientDto from "../domain/value-object/address-client.dto";
import ClientGateway from "../gateway/client.gateway";
import ClientModel from "./client.model";
import ClientEntity from "../domain/client.entity";

export default class ClientRepository implements ClientGateway {
  async add(client: Client): Promise<void> {
    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.address.street,
      city: client.address.city,
      state: client.address.state,
      number: client.address.number,
      zipCode: client.address.zipCode,
      complement: client.address.complement,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
  }
  async find(id: string): Promise<Client> {
    const result = await ClientModel.findOne({ where: { id: id } });

    if (!result) {
      throw new Error("Client not found");
    }
    const client = result.dataValues
    const props = { 
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      address: new AddressClientDto(client.street, client.number, client.city,
        client.zipCode, client.state, client.complement),
      document: client.document,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
    return new ClientEntity(props);
  }
}
