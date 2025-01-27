import { regexUuid } from "@/utils/regex";
import { CreateItem } from "@data/operations/Item";
import { CreatePurchase } from "@data/operations/Purchase";
import { SummaryProduct } from "@data/stands/Product";

export type PurchaseAction =
  | { type: "SET_ON_ORDER"; payload: boolean }
  | { type: "ADD_ITEM"; payload: SummaryProduct }
  | {
      type: "ON_CHANGE_ITEM";
      payload: { uuid: string; quantity: number; stock: number };
    }
  | { type: "DECREASE_ITEM"; payload: string }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "ADD_DELIVERED_ITEM"; payload: string }
  | { type: "COMPLETE_DELIVERED_ITEM"; payload: string }
  | {
      type: "ON_CHANGE_DELIVERED_ITEM";
      payload: { uuid: string; delivered: number };
    }
  | { type: "DECREASE_DELIVERED_ITEM"; payload: string }
  | { type: "REMOVE_DELIVERED_ITEM"; payload: string }
  | { type: "SET_ORDER_CARD_ID"; payload: string }
  | { type: "RESET" };

export const initialPurchaseState: CreatePurchase = {
  onOrder: false,
  items: [],
  orderCardId: "",
};

function findProductIndex(items: CreateItem[], productUuid: string): number {
  return items.findIndex((item) => item.productUuid === productUuid);
}

function updateItemInList(
  items: CreateItem[],
  index: number,
  updateCallback: (item: CreateItem) => CreateItem,
): CreateItem[] {
  return items.map((item, i) => (i === index ? updateCallback(item) : item));
}

function createNewItem(product: SummaryProduct): CreateItem {
  return {
    productUuid: product.uuid,
    quantity: 1,
    delivered: 0,
    unitPrice: product.price,
    discount: product.discount,
  };
}

function updateQuantity(item: CreateItem, newQuantity: number): CreateItem {
  return { ...item, quantity: newQuantity };
}

function updateDelivered(item: CreateItem, newDelivered: number): CreateItem {
  return { ...item, delivered: newDelivered };
}

export function purchaseReducer(
  state: CreatePurchase,
  action: PurchaseAction,
): CreatePurchase {
  switch (action.type) {
    case "SET_ON_ORDER":
      return { ...state, onOrder: action.payload };

    case "ADD_ITEM": {
      const newProduct = action.payload;
      if (newProduct.stock === 0) return state;

      const productIndex = findProductIndex(state.items, newProduct.uuid);

      if (productIndex === -1) {
        const newItem = createNewItem(newProduct);
        return { ...state, items: [...state.items, newItem] };
      } else {
        return {
          ...state,
          items: updateItemInList(state.items, productIndex, (item) =>
            updateQuantity(
              item,
              item.quantity < newProduct.stock
                ? item.quantity + 1
                : item.quantity,
            ),
          ),
        };
      }
    }

    case "ON_CHANGE_ITEM": {
      if (action.payload.quantity >= action.payload.stock) return state;

      const productIndex = findProductIndex(state.items, action.payload.uuid);
      return {
        ...state,
        items: updateItemInList(state.items, productIndex, (item) =>
          updateQuantity(item, action.payload.quantity),
        ),
      };
    }

    case "DECREASE_ITEM": {
      const productIndex = findProductIndex(state.items, action.payload);
      if (productIndex === -1) return state;

      const item = state.items[productIndex];
      if (item.quantity === 1) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.productUuid !== action.payload,
          ),
        };
      }

      return {
        ...state,
        items: updateItemInList(state.items, productIndex, (item) =>
          updateQuantity(item, item.quantity - 1),
        ),
      };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.productUuid !== action.payload,
        ),
      };

    case "ADD_DELIVERED_ITEM": {
      const productIndex = findProductIndex(state.items, action.payload);
      return {
        ...state,
        items: updateItemInList(state.items, productIndex, (item) =>
          updateDelivered(
            item,
            item.delivered < item.quantity
              ? item.delivered + 1
              : item.delivered,
          ),
        ),
      };
    }

    case "COMPLETE_DELIVERED_ITEM": {
      const productIndex = findProductIndex(state.items, action.payload);
      return {
        ...state,
        items: updateItemInList(state.items, productIndex, (item) =>
          updateDelivered(item, item.quantity),
        ),
      };
    }

    case "ON_CHANGE_DELIVERED_ITEM": {
      const productIndex = findProductIndex(state.items, action.payload.uuid);
      return {
        ...state,
        items: updateItemInList(state.items, productIndex, (item) =>
          updateDelivered(
            item,
            Math.min(action.payload.delivered, item.quantity),
          ),
        ),
      };
    }

    case "REMOVE_DELIVERED_ITEM": {
      const productIndex = findProductIndex(state.items, action.payload);
      return {
        ...state,
        items: updateItemInList(state.items, productIndex, (item) =>
          updateDelivered(item, 0),
        ),
      };
    }

    case "SET_ORDER_CARD_ID":
      if (!regexUuid.test(action.payload)) {
        return state;
      }
      return { ...state, orderCardId: action.payload };

    case "RESET":
      return initialPurchaseState;

    default:
      throw new Error("Ação desconhecida no reducer");
  }
}
