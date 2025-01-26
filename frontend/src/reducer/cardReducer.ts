import { regexLeterNumber } from "@/utils/regex";
import { RequestOrderCard } from "@data/customers/OrderCard";

type CardAction = { type: "SET_CARD"; payload: string } | { type: "RESET" };

export const initialCardState: RequestOrderCard = {
  cardId: "",
};

export function cardReducer(
  state: RequestOrderCard,
  action: CardAction,
): RequestOrderCard {
  switch (action.type) {
    case "SET_CARD": {
      if (!regexLeterNumber.test(action.payload)) {
        return state;
      }
      return { ...state, cardId: action.payload };
    }
    case "RESET": {
      return initialCardState;
    }
    default:
      throw new Error("Unknown action in card reducer");
  }
}
