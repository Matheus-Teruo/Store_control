import {
  regexLeterNumber,
  regexLeterSpace,
  regexPassword,
} from "@/utils/regex";
import { LoginVoluntary, SignupVoluntary } from "@data/volunteers/User";

type SignupAction =
  | { type: "SET_USERNAME"; payload: string }
  | { type: "SET_FULLNAME"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string }
  | { type: "SET_ASSOCIATION_KEY"; payload: string }
  | { type: "RESET" };

export const initialUserState: SignupVoluntary & { confirmPassword: string } = {
  username: "",
  fullname: "",
  password: "",
  confirmPassword: "",
  associationKey: "",
};

export function userReducer(
  state: SignupVoluntary & { confirmPassword: string },
  action: SignupAction,
): SignupVoluntary & { confirmPassword: string } {
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
    case "SET_ASSOCIATION_KEY": {
      if (!regexLeterNumber.test(action.payload)) {
        return state;
      }
      return { ...state, associationKey: action.payload };
    }
    case "RESET":
      return initialUserState;
    default:
      throw new Error("Ação desconhecida no reducer");
  }
}

export const signupPayload = (
  state: SignupVoluntary & { confirmPassword: string },
): SignupVoluntary => {
  const { confirmPassword: _confirmPassword, ...signupPayload } = state;
  return signupPayload as SignupVoluntary;
};

export const loginPayload = (
  state: SignupVoluntary & { confirmPassword: string },
): LoginVoluntary => {
  const {
    fullname: _fullname,
    confirmPassword: _confirmPassword,
    associationKey: _associationKey,
    ...signupPayload
  } = state;
  return signupPayload as LoginVoluntary;
};
