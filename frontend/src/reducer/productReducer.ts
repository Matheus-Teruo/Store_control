import { regexLeterNumberSpace, regexText, regexUuid } from "@/utils/regex";
import { CreateProduct } from "@data/stands/Product";

type ProductAction =
  | { type: "SET_PRODUCT_NAME"; payload: string }
  | { type: "SET_SUMMARY"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_PRICE"; payload: number }
  | { type: "SET_STOCK"; payload: number }
  | { type: "SET_PRODUCT_IMG"; payload: string | null }
  | { type: "SET_STAND_UUID"; payload: string }
  | { type: "RESET" };

export const initialProductState: CreateProduct = {
  productName: "",
  summary: "",
  description: "",
  price: 0,
  stock: 0,
  productImg: null,
  standUuid: "",
};

export function productReducer(
  state: CreateProduct,
  action: ProductAction,
): CreateProduct {
  switch (action.type) {
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
    case "SET_PRICE":
      if (action.payload < 0) {
        return state;
      }
      return { ...state, price: action.payload };
    case "SET_STOCK":
      if (action.payload < 0) {
        return state;
      }
      return { ...state, stock: action.payload };
    case "SET_PRODUCT_IMG":
      return { ...state, productImg: action.payload };
    case "SET_STAND_UUID":
      if (!regexUuid.test(action.payload)) {
        return state;
      }
      return { ...state, standUuid: action.payload };
    case "RESET":
      return initialProductState;
    default:
      throw new Error("Ação desconhecida no reducer");
  }
}

export function checkCreateProduct(
  state: CreateProduct,
):
  | "productName"
  | "summary"
  | "description"
  | "price"
  | "stock"
  | "standUuid"
  | null {
  if (
    state.productName.length < 3 &&
    !regexLeterNumberSpace.test(state.productName)
  )
    return "productName";
  if (state.summary && !regexText.test(state.summary)) return "summary";
  if (state.description && !regexText.test(state.description))
    return "description";
  if (state.price < 0) return "price";
  if (state.stock < 0) return "stock";
  if (!regexUuid.test(state.standUuid) || state.standUuid === "")
    return "standUuid";
  return null;
}

export function checkUpdateProduct(
  state: CreateProduct,
):
  | "productName"
  | "summary"
  | "description"
  | "price"
  | "stock"
  | "standUuid"
  | null {
  if (
    state.productName &&
    state.productName.length < 3 &&
    !regexLeterNumberSpace.test(state.productName)
  )
    return "productName";
  if (state.summary && !regexText.test(state.summary)) return "summary";
  if (state.description && !regexText.test(state.description))
    return "description";
  if (state.price && state.price < 0) return "price";
  if (state.stock && state.stock < 0) return "stock";
  if (
    (state.standUuid && !regexUuid.test(state.standUuid)) ||
    state.standUuid === ""
  )
    return "standUuid";
  return null;
}
