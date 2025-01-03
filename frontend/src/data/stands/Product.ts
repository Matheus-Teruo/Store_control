import Stand from "./Stand";

export default interface Products{
  uuid: string;
  productName: string;
  price: number;
  discount: number;
  stock: number;
  productImg?: string | null;
  stand: Stand;
}

export interface SummaryProducts{
  uuid: string;
  productName: string;
  price: number;
  discount: number;
  stock: number;
  productImg?: string | null;
  standUuid: string;
}