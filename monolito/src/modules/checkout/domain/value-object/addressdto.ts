export default class AddressDto {
  private _street: string;
  private _number: string;
  private _city: string;
  private _zipCode: string;
  private _state: string;
  private _complement: string;

  constructor(
  street: string,
  number: string,
  city: string,
  zipCode: string,
  state: string,
  complement: string
  ){
      this._city = city;
      this._number = number;
      this._street = street;
      this._zipCode = zipCode;
      this._state = state;
      this._complement = complement 
  }

  get street(): string{
      return this._street
  }

  get number(): string{
      return this._number;
  }

  get city(): string{
      return this._city;
  }

  get zipCode(): string{
      return this._zipCode;
  }

  get complement(): string{
      return this._complement;
  }

  get state(): string{
      return this._state
  }

}