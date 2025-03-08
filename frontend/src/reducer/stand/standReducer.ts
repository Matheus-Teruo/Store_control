import { regexLeterNumberSpace, regexUuid } from "@/utils/regex";
import Stand, { CreateStand, UpdateStand } from "@data/stands/Stand";

type StandAction =
  | { type: "SET_STAND"; payload: Stand }
  | { type: "SET_STAND_NAME"; payload: string }
  | { type: "SET_ASSOCIATION_UUID"; payload: string }
  | { type: "SET_UUID"; payload: string }
  | { type: "RESET" };

export const initialStandState: CreateStand & UpdateStand = {
  uuid: "",
  standName: "",
  associationUuid: "",
};

export function standReducer(
  state: CreateStand & UpdateStand,
  action: StandAction,
): CreateStand & UpdateStand {
  switch (action.type) {
    case "SET_STAND": {
      return {
        uuid: action.payload.uuid,
        standName: action.payload.standName,
        associationUuid: action.payload.association.uuid,
      };
    }
    case "SET_STAND_NAME": {
      if (!regexLeterNumberSpace.test(action.payload)) {
        return state;
      }
      return { ...state, standName: action.payload };
    }
    case "SET_ASSOCIATION_UUID": {
      if (!regexUuid.test(action.payload)) {
        return state;
      }
      return { ...state, associationUuid: action.payload };
    }
    case "RESET": {
      return initialStandState;
    }
    default:
      throw new Error("Unknown action in stand reducer");
  }
}

export const createStandPayload = (
  state: CreateStand & Partial<UpdateStand>,
): CreateStand => {
  const { uuid: _uuid, ...createPayload } = state;
  return createPayload;
};

export const updateStandPayload = (
  state: CreateStand & Partial<UpdateStand>,
  initial: Stand,
): UpdateStand => {
  const { uuid, standName, ...rest } = state;
  if (!uuid || !regexUuid.test(uuid)) {
    throw new Error("UUID is required to update the stand");
  }

  if (standName === initial.standName) {
    return { ...rest, uuid };
  }

  return { ...rest, uuid };
};
