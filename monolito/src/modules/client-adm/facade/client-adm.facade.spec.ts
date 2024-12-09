import { Sequelize } from "sequelize-typescript";
import { clientModel } from "../repository/client.model";
import ClientRepository from "../repository/client.repository";
import AddClientUsecase from "../usecase/add-client/add-client.usecase";
import Client from "../domain/client.entity";
import ClientAdmFacade from "./client-adm.facade";
import FindClientUsecase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadadeFactory from "../factory/facade.factory";

describe("ClientAdmFacade test", () => {
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
    const clientFacade = ClientAdmFacadadeFactory.create();

    const input = {
      id: "1",
      name: "Client 1",
      email: "teste@teste.com",
      address: "Client 1 address",
    };

    await clientFacade.add(input);

    const client = await clientModel.findOne({ where: { id: input.id } });

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.address).toBe(input.address);
  });

  it("should find a client", async () => {
    const clientFacade = ClientAdmFacadadeFactory.create();

    const input = {
      id: "1",
      name: "Client 1",
      email: "teste@teste.com",
      address: "Client 1 address",
    };

    await clientFacade.add(input);

    const client = await clientFacade.find({
      id: input.id,
    });

    expect(client).toBeDefined();
    expect(client.id).toBe(input.id);
    expect(client.name).toBe(input.name);
    expect(client.email).toBe(input.email);
    expect(client.address).toBe(input.address);
  });
});
