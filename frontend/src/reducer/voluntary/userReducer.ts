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

export function checkSignupUser(
  state: SignupFormState,
): "username" | "fullname" | "password" | "confirmPassword" | null {
  if (state.username.length < 3 && !regexLeterNumber.test(state.username))
    return "username";
  if (state.fullname.length < 3 && !regexLeterSpace.test(state.fullname))
    return "fullname";
  if (state.password.length < 8 && !regexPassword.test(state.password))
    return "password";
  if (state.password === state.confirmPassword) return "password";
  return null;
}

export function checkUpdateUser(
  state: SignupFormState,
  update: "username" | "fullname" | "password" | "",
): "username" | "fullname" | "password" | "confirmPassword" | null {
  if (
    update === "username" &&
    state.username.length < 3 &&
    !regexLeterNumber.test(state.username)
  )
    return "username";
  if (
    update === "fullname" &&
    state.fullname.length < 3 &&
    !regexLeterSpace.test(state.fullname)
  )
    return "fullname";
  if (
    update === "password" &&
    state.password.length < 8 &&
    !regexPassword.test(state.password)
  )
    return "password";
  if (update === "password" && state.password === state.confirmPassword)
    return "confirmPassword";
  return null;
}
