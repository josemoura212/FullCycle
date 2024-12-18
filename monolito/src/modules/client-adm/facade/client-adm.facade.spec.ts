import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import AddressClientDto from "../domain/value-object/address-client.dto";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";
import ClientModel from "../repository/client.model";

describe("ClientAdmFacade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const facade =  ClientAdmFacadeFactory.create();

    const input = {
      id: new Id('1'),
      name: 'Client 1',
      document: 'doc',
      email: 'x@x.com',
      address: new AddressClientDto('street', '1', 'city', 'zipcode', 'state', 'complement')
    };

    await facade.add(input);
    const client = await ClientModel.findOne({ where: { id: '1' }});

    expect(client).toBeDefined();
    expect(client.id).toEqual('1');
    expect(client.name).toBe('Client 1');
    expect(client.email).toBe('x@x.com');
    expect(client.city).toStrictEqual(input.address.city);
  });

  it('should find a client',async () => {
    await ClientModel.create({
        id: '2',
        name: 'client 2',
        email: 'teste@teste',
        document: 'doc',
        street: 'street',
        state: 'state',
        complement: 'complement',
        zipCode: 'zipcode',
        number: '2',
        city: 'city',
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const clientFacade = ClientAdmFacadeFactory.create();
    const result = await clientFacade.find({id: '2'});
    expect(result).toBeDefined();
    expect(result.id).toBe('2')
    expect(result.name).toBe('client 2')
    expect(result.email).toBe('teste@teste')
    expect(result.address.city).toBe('city')
})
});
