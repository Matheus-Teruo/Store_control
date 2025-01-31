import { regexUuid } from "@/utils/regex";
import { CreateItem } from "@data/operations/Item";
import { CreatePurchase } from "@data/operations/Purchase";
import { SummaryProduct } from "@data/stands/Product";

export type PurchaseAction =
  | { type: "ADD_ITEM"; payload: SummaryProduct }
  | {
      type: "ON_CHANGE_ITEM";
      payload: { uuid: string; quantity: number; stock: number };
    }
  | { type: "DECREASE_ITEM"; payload: string }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "SET_CARD_ID"; payload: string }
  | { type: "RESET" };

export const initialPurchaseState: CreatePurchase & {
  totalPrice: number;
  totalQuantity: number;
} = {
  onOrder: false,
  items: [],
  orderCardId: "",
  totalPrice: 0,
  totalQuantity: 0,
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

function calculateTotals(items: CreateItem[]): {
  totalPrice: number;
  totalQuantity: number;
} {
  const totalPrice = items.reduce(
    (sum, item) =>
      sum + item.quantity * (item.unitPrice - (item.discount || 0)),
    0,
  );
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return { totalPrice, totalQuantity };
}

export function purchaseReducer(
  state: CreatePurchase & { totalPrice: number; totalQuantity: number },
  action: PurchaseAction,
): CreatePurchase & { totalPrice: number; totalQuantity: number } {
  switch (action.type) {
    case "ADD_ITEM": {
      const newProduct = action.payload;
      if (newProduct.stock === 0) return state;

      const productIndex = findProductIndex(state.items, newProduct.uuid);

      let updatedItems;
      if (productIndex === -1) {
        const newItem = createNewItem(newProduct);
        updatedItems = [...state.items, newItem];
      } else {
        updatedItems = updateItemInList(state.items, productIndex, (item) =>
          updateQuantity(
            item,
            item.quantity < newProduct.stock
              ? item.quantity + 1
              : item.quantity,
          ),
        );
      }

      const totals = calculateTotals(updatedItems);
      return { ...state, items: updatedItems, ...totals };
    }

    case "ON_CHANGE_ITEM": {
      if (action.payload.quantity >= action.payload.stock) return state;

      const productIndex = findProductIndex(state.items, action.payload.uuid);
      const updatedItems = updateItemInList(state.items, productIndex, (item) =>
        updateQuantity(item, action.payload.quantity),
      );

      const totals = calculateTotals(updatedItems);
      return { ...state, items: updatedItems, ...totals };
    }

    case "DECREASE_ITEM": {
      const productIndex = findProductIndex(state.items, action.payload);
      if (productIndex === -1) return state;

      const item = state.items[productIndex];
      let updatedItems;
      if (item.quantity <= 1) {
        updatedItems = state.items.filter(
          (item) => item.productUuid !== action.payload,
        );
      } else {
        updatedItems = updateItemInList(state.items, productIndex, (item) =>
          updateQuantity(item, item.quantity - 1),
        );
      }

      const totals = calculateTotals(updatedItems);
      return { ...state, items: updatedItems, ...totals };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.productUuid !== action.payload,
      );

      const totals = calculateTotals(updatedItems);
      return { ...state, items: updatedItems, ...totals };
    }

    case "SET_CARD_ID":
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

export const createPurchasePayload = (
  state: CreatePurchase & { totalPrice: number; totalQuantity: number },
): CreatePurchase => {
  const {
    totalPrice: _totalPrice,
    totalQuantity: _totalQuantity,
    ...rest
  } = state;

  return { ...rest };
};
