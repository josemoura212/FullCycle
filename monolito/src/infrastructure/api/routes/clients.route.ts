import express, { Request, Response } from "express";
import Id from "../../../modules/@shared/domain/value-object/id.value-object";
import AddressClientDto from "../../../modules/client-adm/domain/value-object/address-client.dto";
import ClientRepository from "../../../modules/client-adm/repository/client.repository";
import AddClientUseCase from "../../../modules/client-adm/usecase/add-client/add-client.usecase";
import FindClientUseCase from "../../../modules/client-adm/usecase/find-client/find-client.usecase";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new AddClientUseCase(new ClientRepository());
  try {
    const clientDto = {
      id: new Id(req.body.id),
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: new AddressClientDto(
        req.body.address.street,
        req.body.address.number,
        req.body.address.city,
        req.body.address.zipCode,
        req.body.address.state,
        req.body.address.complement
      )};
    const output = await usecase.execute(clientDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});

clientRoute.get("/:id", async (req: Request, res: Response) => {
  const usecase = new FindClientUseCase(new ClientRepository());
  const output = await usecase.execute({id: req.params.id});
  res.format({
    json: async () => res.send(output),
  });
});
