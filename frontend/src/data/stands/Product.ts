import ProductCombo, { CreateProductCombo } from "./ProductCombo";
import Stand from "./Stand";
import Tag from "./Tag";

export default interface Product {
  uuid: string;
  productName: string;
  tags: Tag[];
  summary: string;
  description: string;
  combo: boolean;
  productCombos: ProductCombo[];
  price: number;
  discount: number;
  stock: number | null;
  productImg: string | null;
  stand: Stand;
}

export interface ResponseImage {
  url: string;
}

export interface SummaryProduct {
  uuid: string;
  productName: string;
  summary: string;
  description: boolean;
  combo: boolean;
  price: number;
  discount: number;
  stock: number;
  productImg?: string | null;
  standUuid: string;
}

export interface CreateProduct {
  productName: string;
  tagsUuid: string[];
  summary?: string;
  description?: string;
  comboProducts: CreateProductCombo[];
  price: number;
  stock: number | null;
  productImg?: string | null;
  standUuid: string;
}

export interface UpdateProduct {
  uuid: string;
  productName?: string;
  tagsUuid?: string[];
  summary?: string;
  description?: string;
  comboProducts: CreateProductCombo[];
  price?: number;
  discount?: number;
  stock: number | null;
  productImg?: string | null;
  standUuid?: string;
}
