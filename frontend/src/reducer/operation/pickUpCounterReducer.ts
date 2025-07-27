import Item from "@data/operations/Item";
import { PurchaseCard, UpdatePurchase } from "@data/operations/Purchase";

export type PickUpCounterAction =
  | {
      type: "SET_CART";
      payload: { purchases: PurchaseCard[]; cardId: string };
    }
  | {
      type: "ADD_DELIVERED_ITEM";
      payload: { purchaseUuid: string; uuid: string };
    }
  | {
      type: "COMPLETE_DELIVERED_ITEM";
      payload: { purchaseUuid: string; uuid: string };
    }
  | {
      type: "ON_CHANGE_DELIVERED_ITEM";
      payload: { purchaseUuid: string; uuid: string; delivered: number };
    }
  | {
      type: "DECREASE_DELIVERED_ITEM";
      payload: { purchaseUuid: string; uuid: string };
    }
  | { type: "SET_CARD_ID"; payload: string }
  | { type: "RESET" };

export const initialPickUpCounterState: {
  purchases: PurchaseCard[];
  cardId: string;
} = {
  purchases: [],
  cardId: "",
};

function updateItem(
  state: { purchases: PurchaseCard[]; cardId: string },
  purchaseUuid: string,
  productUuid: string,
  updater: (item: Item) => Partial<Item>,
): PurchaseCard[] {
  return state.purchases.map((purchase) => {
    if (purchase.uuid !== purchaseUuid) return purchase;

    return {
      ...purchase,
      items: purchase.items.map((item) =>
        item.productUuid === productUuid ? { ...item, ...updater(item) } : item,
      ),
    };
  });
}

export function pickUpCounterReducer(
  state: { purchases: PurchaseCard[]; cardId: string },
  action: PickUpCounterAction,
): { purchases: PurchaseCard[]; cardId: string } {
  switch (action.type) {
    case "SET_CART":
      return action.payload;

    case "ADD_DELIVERED_ITEM": {
      return {
        ...state,
        purchases: updateItem(
          state,
          action.payload.purchaseUuid,
          action.payload.uuid,
          (item) => ({
            delivered:
              (item.delivered ?? 0) < item.quantity
                ? (item.delivered ?? 0) + 1
                : item.delivered,
          }),
        ),
      };
    }

    case "COMPLETE_DELIVERED_ITEM": {
      return {
        ...state,
        purchases: updateItem(
          state,
          action.payload.purchaseUuid,
          action.payload.uuid,
          (item) => ({
            delivered: item.quantity,
          }),
        ),
      };
    }

    case "ON_CHANGE_DELIVERED_ITEM": {
      return {
        ...state,
        purchases: updateItem(
          state,
          action.payload.purchaseUuid,
          action.payload.uuid,
          (item) => ({
            delivered:
              action.payload.delivered <= item.quantity
                ? action.payload.delivered
                : item.delivered,
          }),
        ),
      };
    }

    case "DECREASE_DELIVERED_ITEM": {
      return {
        ...state,
        purchases: updateItem(
          state,
          action.payload.purchaseUuid,
          action.payload.uuid,
          (item) => ({
            delivered: Math.max((item.delivered ?? 0) - 1, 0),
          }),
        ),
      };
    }

    case "SET_CARD_ID":
      if (action.payload.length > 15) {
        return state;
      }
      return { ...state, cardId: action.payload };

    case "RESET":
      return initialPickUpCounterState;

    default:
      throw new Error("Ação desconhecida no reducer");
  }
}

export const updatePurchasesPayload = (state: {
  purchases: PurchaseCard[];
  cardId: string;
}): UpdatePurchase[] => {
  const { purchases, cardId } = state;

  return purchases.map((purchase) => ({
    uuid: purchase.uuid,
    cardId: cardId,
    items: purchase.items.map((item) => ({
      productUuid: item.productUuid,
      delivered: item.delivered,
    })),
  }));
};
