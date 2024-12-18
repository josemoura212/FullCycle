import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import AddressDto from "./value-object/addressdto";

type ClientProps = {
    id?: Id;
    name: string;
    email: string;
    document: string;
    address?: AddressDto;
};

export default class Client extends BaseEntity implements AggregateRoot{
    private _name: string;
    private _email: string;
    private _document: string;
    private _address: AddressDto;

    get name(): string{
        return this._name;
    }

    get email(): string{
        return this._email;
    }

    get address(): AddressDto{
        return this._address;
    }

    get document(): string{
        return this._document;
    }

    constructor(props: ClientProps){
        super(props.id);
        this._name = props.name;
        this._email = props.email;
        this._address = props.address;
        this._document = props.document;
    }
}