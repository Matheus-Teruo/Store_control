import { regexUuid } from "@/utils/regex";
import { CreateItem } from "@data/operations/Item";
import { CreatePurchase, PurchaseCard } from "@data/operations/Purchase";
import { SummaryProduct } from "@data/stands/Product";

export type PurchaseAction =
  | {
      type: "SET_CART";
      payload: { purchase: PurchaseCard; cardId: string };
    }
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
  | { type: "SET_STAND_UUID"; payload: string }
  | { type: "SET_CARD_ID"; payload: string }
  | { type: "RESET" };

export const initialPurchaseState: CreatePurchase & {
  totalPrice: number;
  totalQuantity: number;
} = {
  standUuid: "",
  items: [],
  cardId: "",
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

function updateDelivered(
  item: CreateItem,
  newDelivered: number | undefined,
): CreateItem {
  return { ...item, delivered: newDelivered };
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
    case "SET_CART":
      return {
        ...state,
        standUuid: action.payload.purchase.standUuid,
        items: action.payload.purchase.items,
        cardId: action.payload.cardId,
        totalPrice: action.payload.purchase.items.reduce(
          (total, item) =>
            total + item.quantity * (item.unitPrice - item.discount),
          0,
        ),
        totalQuantity: action.payload.purchase.items.reduce(
          (soma, item) => soma + item.quantity,
          0,
        ),
      };
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

    case "ADD_DELIVERED_ITEM": {
      const productIndex = findProductIndex(state.items, action.payload);
      return {
        ...state,
        items: updateItemInList(state.items, productIndex, (item) =>
          updateDelivered(
            item,
            item.delivered !== undefined
              ? item.delivered < item.quantity
                ? item.delivered + 1
                : item.delivered
              : undefined,
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

    case "DECREASE_DELIVERED_ITEM": {
      const productIndex = findProductIndex(state.items, action.payload);
      return {
        ...state,
        items: updateItemInList(state.items, productIndex, (item) =>
          updateDelivered(
            item,
            Math.max(item.delivered !== undefined ? item.delivered + 1 : 1, 0),
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

    case "SET_STAND_UUID": {
      if (!regexUuid.test(action.payload)) {
        return state;
      }
      if (state.standUuid !== action.payload) {
        const totals = calculateTotals([]);
        return { ...state, standUuid: action.payload, items: [], ...totals };
      } else {
        return { ...state, standUuid: action.payload };
      }
    }

    case "SET_CARD_ID":
      if (!regexUuid.test(action.payload)) {
        return state;
      }
      return { ...state, cardId: action.payload };

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
