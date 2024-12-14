import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import Address from "../../@shared/domain/value-object/address.value-object";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoceItem from "./invoce-item";

type InvoceProps = {
  id?: Id;
  name: string;
  document: string;
  address: Address;
  items: InvoceItem[];
  createdAt?: Date;
  updatedAt?: Date;
};

export default class Invoce extends BaseEntity implements AggregateRoot {
  private _name: string;
  private _document: string;
  private _address: Address;
  private _items: InvoceItem[];

  constructor(props: InvoceProps) {
    super(props.id, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._document = props.document;
    this._address = props.address;
    this._items = props.items;
  }

  get name(): string {
    return this._name;
  }

  get document(): string {
    return this._document;
  }

  get address(): Address {
    return this._address;
  }

  get items(): InvoceItem[] {
    return this._items;
  }

  get total(): number {
    return this._items.reduce((acc, item) => acc + item.price, 0);
  }
}
