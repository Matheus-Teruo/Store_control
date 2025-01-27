import { regexUuid } from "@/utils/regex";
import { CreateRecharge, PaymentType } from "@data/operations/Recharge";

type RechargeAction =
  | { type: "SET_RECHARGE_VALUE"; payload: number }
  | { type: "SET_RECHARGE_TYPE"; payload: PaymentType }
  | { type: "SET_CARD_ID"; payload: string }
  | { type: "SET_CASH_REGISTER_UUID"; payload: string }
  | { type: "RESET" };

export const initialRechargeState: CreateRecharge = {
  rechargeValue: 0,
  paymentTypeEnum: PaymentType.CASH,
  orderCardId: "",
  cashRegisterUuid: "",
};

export function rechargeReducer(
  state: CreateRecharge,
  action: RechargeAction,
): CreateRecharge {
  switch (action.type) {
    case "SET_RECHARGE_VALUE": {
      if (action.payload < 0) {
        return state;
      }
      return { ...state, rechargeValue: action.payload };
    }
    case "SET_RECHARGE_TYPE": {
      return { ...state, paymentTypeEnum: action.payload };
    }
    case "SET_CARD_ID": {
      if (!regexUuid.test(action.payload)) {
        return state;
      }
      return { ...state, orderCardId: action.payload };
    }
    case "SET_CASH_REGISTER_UUID": {
      if (!regexUuid.test(action.payload)) {
        return state;
      }
      return { ...state, cashRegisterUuid: action.payload };
    }
    case "RESET": {
      return initialRechargeState;
    }
    default:
      throw new Error("Ação desconhecida no reducer");
  }
}
