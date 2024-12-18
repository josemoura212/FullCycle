import AddressClientDto from "../../domain/value-object/address-client.dto";

export interface FindClientInputDto {
  id: string;
}

export interface FindClientOutputDto {
  id: string;
  name: string;
  email: string;
  address: AddressClientDto;
  document: string;
  createdAt: Date;
  updatedAt: Date;
}
