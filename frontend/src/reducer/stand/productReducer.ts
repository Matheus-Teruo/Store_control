import { regexLeterNumberSpace, regexText, regexUuid } from "@/utils/regex";
import Product, { CreateProduct, UpdateProduct } from "@data/stands/Product";

type ProductAction =
  | { type: "SET_PRODUCT"; payload: Product }
  | { type: "SET_PRODUCT_NAME"; payload: string }
  | { type: "SET_SUMMARY"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_PRICE"; payload: number }
  | { type: "SET_DISCOUNT"; payload: number }
  | { type: "SET_STOCK"; payload: number }
  | { type: "SET_PRODUCT_IMG"; payload: string }
  | { type: "SET_STAND_UUID"; payload: string | undefined }
  | { type: "RESET" };

export const initialProductState: CreateProduct & UpdateProduct = {
  uuid: "",
  productName: "",
  summary: undefined,
  description: undefined,
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
        summary:
          action.payload.summary !== "" ? action.payload.summary : undefined,
        description:
          action.payload.description !== ""
            ? action.payload.description
            : undefined,
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
      if (action.payload === "") {
        return { ...state, summary: undefined };
      }
      return { ...state, summary: action.payload };
    case "SET_DESCRIPTION":
      if (!regexText.test(action.payload)) {
        return state;
      }
      if (action.payload === "") {
        return { ...state, description: undefined };
      }
      return { ...state, description: action.payload };
    case "SET_PRICE":
      if (action.payload < 0) {
        return state;
      }
      return { ...state, price: action.payload };
    case "SET_DISCOUNT":
      if (action.payload < 0 && action.payload <= state.price) {
        return state;
      }
      return { ...state, discount: action.payload };
    case "SET_STOCK":
      if (action.payload < 0) {
        return state;
      }
      return { ...state, stock: action.payload };
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
  const { uuid: _uuid, discount: _discount, ...createPayload } = state;
  return createPayload;
};

export const updateProductPayload = (
  state: CreateProduct & UpdateProduct,
  initial: Product,
): UpdateProduct => {
  const { uuid, productName, ...rest } = state;
  if (!uuid || !regexUuid.test(uuid))
    throw new Error("UUID é obrigatório para atualizar o produto");

  if (productName === initial.productName) {
    return { ...rest, uuid };
  }

  return { ...rest, uuid, productName };
};
