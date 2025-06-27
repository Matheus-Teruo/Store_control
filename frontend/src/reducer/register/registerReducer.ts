import { regexLeterNumberSpace, regexUuid } from "@/utils/regex";
import Register, {
  CreateRegister,
  UpdateRegister,
} from "@data/registers/Register";

type RegisterAction =
  | { type: "SET_REGISTER"; payload: Register }
  | { type: "SET_REGISTER_NAME"; payload: string }
  | { type: "SET_STAND_UUID"; payload: string | undefined }
  | { type: "RESET" };

export const initialRegisterState: CreateRegister & UpdateRegister = {
  uuid: "",
  registerName: "",
  standUuid: undefined,
};

export function registerReducer(
  state: CreateRegister & UpdateRegister,
  action: RegisterAction,
): CreateRegister & UpdateRegister {
  switch (action.type) {
    case "SET_REGISTER": {
      return {
        uuid: action.payload.uuid,
        registerName: action.payload.registerName,
        standUuid: action.payload.summaryStand
          ? action.payload.summaryStand.uuid
          : undefined,
      };
    }
    case "SET_REGISTER_NAME": {
      if (!regexLeterNumberSpace.test(action.payload)) {
        return state;
      }
      return { ...state, registerName: action.payload };
    }
    case "SET_STAND_UUID": {
      if (action.payload === undefined || !regexUuid.test(action.payload)) {
        return state;
      }
      return {
        ...state,
        standUuid: action.payload,
      };
    }
    case "RESET": {
      return initialRegisterState;
    }
    default:
      throw new Error("Unknown action in register reducer");
  }
}

export const createRegisterPayload = (
  state: CreateRegister & Partial<UpdateRegister>,
): CreateRegister => {
  const { uuid: _uuid, ...createPayload } = state;
  return createPayload;
};

export const updateRegisterPayload = (
  state: CreateRegister & Partial<UpdateRegister>,
  initial: Register,
): UpdateRegister => {
  const { uuid, registerName, ...rest } = state;
  if (!uuid || !regexUuid.test(uuid)) {
    throw new Error("UUID is required to update the register");
  }

  if (registerName === initial.registerName) {
    return { ...rest, uuid };
  }

  return { ...rest, registerName, uuid };
};
