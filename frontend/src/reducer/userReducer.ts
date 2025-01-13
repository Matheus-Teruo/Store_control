import {
  regexLeterNumber,
  regexLeterSpace,
  regexPassword,
} from "@/utils/regex";

interface SignupFormState {
  username: string;
  fullname: string;
  password: string;
  confirmPassword: string;
}

type SignupAction =
  | { type: "SET_USERNAME"; payload: string }
  | { type: "SET_FULLNAME"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string }
  | { type: "RESET" };

export const initialUserState: SignupFormState = {
  username: "",
  fullname: "",
  password: "",
  confirmPassword: "",
};

export function userReducer(
  state: SignupFormState,
  action: SignupAction,
): SignupFormState {
  switch (action.type) {
    case "SET_USERNAME": {
      if (!regexLeterNumber.test(action.payload)) {
        return state;
      }
      return { ...state, username: action.payload };
    }
    case "SET_FULLNAME": {
      if (!regexLeterSpace.test(action.payload)) {
        return state;
      }
      return { ...state, fullname: action.payload };
    }
    case "SET_PASSWORD": {
      if (!regexPassword.test(action.payload)) {
        return state;
      }
      return { ...state, password: action.payload };
    }
    case "SET_CONFIRM_PASSWORD": {
      if (!regexPassword.test(action.payload)) {
        return state;
      }
      return { ...state, confirmPassword: action.payload };
    }
    case "RESET":
      return initialUserState;
    default:
      throw new Error("Ação desconhecida no reducer");
  }
}
