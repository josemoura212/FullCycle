type Product ={
  id: string;
  name: string;
  description: string;
  salesPrice: number;
}

export interface FindAllProductInputDto{}

export interface FindAllProductOutputDto{
  products: Product[]
}