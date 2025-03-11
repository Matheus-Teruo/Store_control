import activeConfig, {
  fixedCardID,
  fixedCashUuid,
} from "@/config/activeConfig";
import { regexUuid } from "@/utils/regex";
import { CreateItem } from "@data/operations/Item";
import { PaymentType } from "@data/operations/Recharge";
import { CreateTrade } from "@data/operations/Trade";
import { SummaryProduct } from "@data/stands/Product";

export type TradeAction =
  | { type: "SET_CART"; payload: string }
  | { type: "SET_ON_ORDER"; payload: boolean }
  | { type: "SET_RECHARGE_TYPE"; payload: PaymentType }
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
  | { type: "SET_CASH_REGISTER_UUID"; payload: string }
  | { type: "SET_ORDER_CARD_ID"; payload: string }
  | { type: "RESET" };

export const initialTradeState: CreateTrade & {
  totalQuantity: number;
} = {
  onOrder: activeConfig.version === "order",
  items: [],
  orderCardId: activeConfig.version === "simple" ? fixedCardID! : "",
  rechargeValue: 0,
  paymentTypeEnum: PaymentType.CASH,
  cashRegisterUuid: activeConfig.version === "simple" ? fixedCashUuid! : "",
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

function updateDelivered(item: CreateItem, newDelivered: number): CreateItem {
  return { ...item, delivered: newDelivered };
}

function calculateTotals(items: CreateItem[]): {
  rechargeValue: number;
  totalQuantity: number;
} {
  const rechargeValue = items.reduce(
    (sum, item) =>
      sum + item.quantity * (item.unitPrice - (item.discount || 0)),
    0,
  );
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return { rechargeValue, totalQuantity };
}

export function tradeReducer(
  state: CreateTrade & { totalQuantity: number },
  action: TradeAction,
): CreateTrade & { totalQuantity: number } {
  switch (action.type) {
    case "SET_CART": {
      const object: CreateTrade & { totalQuantity: number } = JSON.parse(
        action.payload,
      );
      return {
        ...state,
        paymentTypeEnum: object.paymentTypeEnum,
        items: object.items,
        orderCardId: object.orderCardId,
        rechargeValue: object.rechargeValue,
        totalQuantity: object.totalQuantity,
      };
    }

    case "SET_ON_ORDER":
      return { ...state, onOrder: action.payload };

    case "SET_RECHARGE_TYPE":
      return { ...state, paymentTypeEnum: action.payload };

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
      if (action.payload.quantity > action.payload.stock) return state;

      const productIndex = findProductIndex(state.items, action.payload.uuid);
      const updatedItems = updateItemInList(
        state.items,
        productIndex,
        (item) =>
          Number.isNaN(action.payload.quantity)
            ? updateQuantity(item, 0)
            : updateQuantity(item, action.payload.quantity),
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

    case "SET_CASH_REGISTER_UUID": {
      if (!regexUuid.test(action.payload)) {
        return state;
      }
      return { ...state, cashRegisterUuid: action.payload };
    }

    case "SET_ORDER_CARD_ID":
      if (!regexUuid.test(action.payload)) {
        return state;
      }
      return { ...state, orderCardId: action.payload };

    case "RESET":
      return initialTradeState;

    default:
      throw new Error("Ação desconhecida no reducer");
  }
}

export const createTradePayload = (
  state: CreateTrade & { totalQuantity: number },
): CreateTrade => {
  const { totalQuantity: _totalQuantity, items, ...rest } = state;
  const validItems = items.filter((item) => item.quantity !== 0);
  return { items: validItems, ...rest };
};
