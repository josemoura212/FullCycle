import { Sequelize } from "sequelize-typescript";
import { clientModel } from "./client.model";
import ClientRepository from "./client.repository";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("Client Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([clientModel]);
    await sequelize.sync();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should add a client", async () => {
    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "teste@gmail.com",
      address: "Client 1 address",
    });

    const clientRepository = new ClientRepository();
    await clientRepository.add(client);

    const result = await clientModel.findOne({ where: { id: client.id.id } });

    expect(result.id).toBe(client.id.id);
    expect(result.name).toBe(client.name);
    expect(result.email).toBe(client.email);
    expect(result.address).toBe(client.address);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  });

  it("should find a client", async () => {
    const client = await clientModel.create({
      id: "1",
      name: "Client 1",
      email: "teste@gmail.com",
      address: "Client 1 address",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const clientRepository = new ClientRepository();

    const result = await clientRepository.find(client.id);

    expect(result.id.id).toBe(client.id);
    expect(result.name).toBe(client.name);
    expect(result.email).toBe(client.email);
    expect(result.address).toBe(client.address);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  });
});
