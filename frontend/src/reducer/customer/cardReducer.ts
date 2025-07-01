import { regexLeterNumber } from "@/utils/regex";
import { RequestCard } from "@data/customers/Card";

type CardAction = { type: "SET_CARD"; payload: string } | { type: "RESET" };

export const initialCardState: RequestCard = {
  cardId: "",
};

export function cardReducer(
  state: RequestCard,
  action: CardAction,
): RequestCard {
  switch (action.type) {
    case "SET_CARD": {
      if (
        !regexLeterNumber.test(action.payload) ||
        action.payload.length > 15
      ) {
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
