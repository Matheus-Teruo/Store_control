import { regexLeterNumberSpace, regexText, regexUuid } from "@/utils/regex";
import Product, { CreateProduct, UpdateProduct } from "@data/stands/Product";

type ProductAction =
  | { type: "SET_PRODUCT"; payload: Product }
  | { type: "SET_PRODUCT_NAME"; payload: string }
  | { type: "SET_SUMMARY"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_PRICE"; payload: string }
  | { type: "SET_DISCOUNT"; payload: string }
  | { type: "SET_STOCK"; payload: number }
  | { type: "SET_PRODUCT_IMG"; payload: string }
  | { type: "SET_STAND_UUID"; payload: string | undefined }
  | { type: "RESET" };

export const initialProductState: CreateProduct & UpdateProduct = {
  uuid: "",
  productName: "",
  summary: "",
  description: "",
  price: 0,
  discount: 0,
  stock: 0,
  productImg: undefined,
  standUuid: "",
};

export function productReducer(
  state: CreateProduct & UpdateProduct,
  action: ProductAction,
): CreateProduct & UpdateProduct {
  switch (action.type) {
    case "SET_PRODUCT": {
      return {
        uuid: action.payload.uuid,
        productName: action.payload.productName,
        summary: action.payload.summary !== null ? action.payload.summary : "",
        description:
          action.payload.description !== null ? action.payload.description : "",
        price: action.payload.price,
        discount: action.payload.discount,
        stock: action.payload.stock,
        productImg:
          action.payload.productImg !== ""
            ? action.payload.productImg
            : undefined,
        standUuid: action.payload.stand.uuid,
      };
    }
    case "SET_PRODUCT_NAME": {
      if (!regexLeterNumberSpace.test(action.payload)) {
        return state;
      }
      return { ...state, productName: action.payload };
    }
    case "SET_SUMMARY":
      if (!regexText.test(action.payload)) {
        return state;
      }
      return { ...state, summary: action.payload };
    case "SET_DESCRIPTION":
      if (!regexText.test(action.payload)) {
        return state;
      }
      return { ...state, description: action.payload };
    case "SET_PRICE": {
      const rawValue = action.payload.replace(/[^0-9]/g, "");
      if (!rawValue) return { ...state, price: 0 };
      const numericValue = parseFloat(rawValue) / 100;
      return { ...state, price: numericValue };
    }
    case "SET_DISCOUNT": {
      const rawValue = action.payload.replace(/[^0-9]/g, "");
      if (!rawValue) return { ...state, discount: 0 };
      const numericValue = parseFloat(rawValue) / 100;
      return { ...state, discount: numericValue };
    }
    case "SET_STOCK":
      return {
        ...state,
        stock: Number.isNaN(action.payload) ? 0 : action.payload,
      };
    case "SET_PRODUCT_IMG":
      return { ...state, productImg: action.payload };
    case "SET_STAND_UUID":
      if (action.payload) {
        if (!regexUuid.test(action.payload)) {
          return state;
        }
        return { ...state, standUuid: action.payload };
      }
      return state;
    case "RESET":
      return initialProductState;
    default:
      throw new Error("Ação desconhecida no reducer");
  }
}

export const createProductPayload = (
  state: CreateProduct & UpdateProduct,
): CreateProduct => {
  const {
    uuid: _uuid,
    summary,
    description,
    discount: _discount,
    ...createPayload
  } = state;
  return {
    summary: summary !== "" ? summary : undefined,
    description: description !== "" ? description : undefined,
    ...createPayload,
  };
};

export const updateProductPayload = (
  state: CreateProduct & UpdateProduct,
  initial: Product,
): UpdateProduct => {
  const { uuid, summary, description, productName, ...rest } = state;
  if (!uuid || !regexUuid.test(uuid))
    throw new Error("UUID é obrigatório para atualizar o produto");

  if (productName === initial.productName) {
    return {
      uuid,
      summary: summary !== "" ? summary : undefined,
      description: description !== "" ? description : undefined,
      ...rest,
    };
  }

  return {
    uuid,
    productName,
    summary: summary !== "" ? summary : undefined,
    description: description !== "" ? description : undefined,
    ...rest,
  };
};
