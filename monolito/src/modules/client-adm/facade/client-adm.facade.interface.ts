import Id from "../../@shared/domain/value-object/id.value-object";
import AddressClientDto from "../domain/value-object/address-client.dto";

export interface AddClientFacadeInputDto{
    id?: Id;
    name: string;
    email: string;
    document: string;
    address: AddressClientDto;
}

export interface FindClientFacadeInputDto{
    id: string;
}

export interface FindClientFacadeOutputDto{
    city: string;
    complement: string;
    number: string;
    state: string;
    street: string;
    zipCode: string;
    id?: string;
    name: string;
    document: string;
    email: string;
    address: AddressClientDto;
    createAt: Date;
    updateAt: Date;
}

export default interface ClientAdmFacadeInterface{
    add(input: AddClientFacadeInputDto): Promise<void>;
    find(input: FindClientFacadeInputDto): Promise<FindClientFacadeOutputDto>;
}