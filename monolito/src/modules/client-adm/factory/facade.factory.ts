import ClientAdmFacade from "../facade/client-adm.facade";
import ClientRepository from "../repository/client.repository";
import AddClientUsecase from "../usecase/add-client/add-client.usecase";
import FindClientUsecase from "../usecase/find-client/find-client.usecase";

export default class ClientAdmFacadadeFactory {
  static create() {
    const clientRepository = new ClientRepository();
    const addClientUsecase = new AddClientUsecase(clientRepository);
    const findClientUsecase = new FindClientUsecase(clientRepository);
    const clientFacade = new ClientAdmFacade({
      addUsecase: addClientUsecase,
      findUsecase: findClientUsecase,
    });

    return clientFacade;
  }
}
