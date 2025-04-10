import Stand from "./Stand";
import Tag from "./Tag";

export default interface Product {
  uuid: string;
  productName: string;
  tags: Tag[];
  summary: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  productImg?: string | null;
  stand: Stand;
}

export interface ResponseImage {
  url: string;
}

export interface SummaryProduct {
  uuid: string;
  productName: string;
  summary: string;
  description?: boolean;
  price: number;
  discount: number;
  stock: number;
  productImg?: string | null;
  standUuid: string;
}

export interface CreateProduct {
  productName: string;
  tagsUuid?: string[];
  summary?: string;
  description?: string;
  price: number;
  stock: number;
  productImg?: string | null;
  standUuid: string;
}

export interface UpdateProduct {
  uuid: string;
  productName?: string;
  tagsUuid?: string[];
  summary?: string;
  description?: string;
  price?: number;
  discount?: number;
  stock?: number;
  productImg?: string | null;
  standUuid?: string;
}
