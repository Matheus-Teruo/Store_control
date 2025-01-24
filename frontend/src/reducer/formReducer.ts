import { regexUuid } from "@/utils/regex";

interface FormState {
  show: boolean;
  type: "create" | "update";
  uuid?: string;
}

type FormAction =
  | { type: "SET_FALSE" }
  | { type: "SET_CREATE" }
  | { type: "SET_UPDATE"; payload: string };

export const initialFormState: FormState = {
  show: false,
  type: "create",
  uuid: undefined,
};

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FALSE": {
      return { ...state, show: false, uuid: undefined };
    }
    case "SET_CREATE": {
      return { ...state, show: true, type: "create", uuid: undefined };
    }
    case "SET_UPDATE": {
      if (!regexUuid.test(action.payload)) {
        return state;
      }
      return { ...state, show: true, type: "update", uuid: action.payload };
    }
    default:
      throw new Error("Unknown action in CRUD reducer");
  }
}
