import Stand from "./Stand";

export default interface Product {
  uuid: string;
  productName: string;
  summary: string;
  description: Text;
  price: number;
  discount: number;
  stock: number;
  productImg?: string | null;
  stand: Stand;
}

export interface SummaryProduct {
  uuid: string;
  productName: string;
  summary: string;
  price: number;
  discount: number;
  stock: number;
  productImg?: string | null;
  standUuid: string;
}

export interface CreateProduct {
  productName: string;
  summary?: string;
  description?: Text;
  price: number;
  stock: number;
  productImg?: string | null;
  standUuid: string;
}

export interface UpdateProduct {
  uuid: string;
  productName: string;
  summary?: string;
  description?: Text;
  price: number;
  discount: number;
  stock: number;
  productImg?: string | null;
  standUuid: string;
}
