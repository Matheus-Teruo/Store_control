import { regexUuid } from "@/utils/regex";
import Voluntary, {
  UpdateVoluntaryFunction,
  UpdateVoluntaryRole,
  VoluntaryRole,
} from "@data/volunteers/Voluntary";

type VoluntaryAction =
  | { type: "SET_VOLUNTARY"; payload: Voluntary }
  | { type: "SET_FUNCTION"; payload: string }
  | { type: "SET_ROLE"; payload: VoluntaryRole }
  | { type: "RESET" };

export const initialVoluntaryState: UpdateVoluntaryFunction &
  UpdateVoluntaryRole & { fullname: string } = {
  uuid: "",
  fullname: "",
  functionUuid: "",
  voluntaryRole: VoluntaryRole.VOLUNTARY,
};

export function voluntaryReducer(
  state: UpdateVoluntaryFunction & UpdateVoluntaryRole & { fullname: string },
  action: VoluntaryAction,
): UpdateVoluntaryFunction & UpdateVoluntaryRole & { fullname: string } {
  switch (action.type) {
    case "SET_VOLUNTARY": {
      if (!regexUuid.test(action.payload.uuid)) {
        return state;
      }
      return {
        ...state,
        uuid: action.payload.uuid,
        fullname: action.payload.fullname,
        functionUuid: action.payload.summaryFunction
          ? action.payload.summaryFunction.uuid
          : "",
        voluntaryRole: action.payload.voluntaryRole,
      };
    }
    case "SET_FUNCTION": {
      if (!regexUuid.test(action.payload)) {
        return state;
      }
      return {
        ...state,
        functionUuid: action.payload,
      };
    }
    case "SET_ROLE": {
      return {
        ...state,
        voluntaryRole: action.payload,
      };
    }
    case "RESET": {
      return initialVoluntaryState;
    }
    default:
      throw new Error("Unknown action in voluntary reducer");
  }
}

export const updateVoluntaryFunctionPayload = (
  state: UpdateVoluntaryFunction & UpdateVoluntaryRole & { fullname: string },
): UpdateVoluntaryFunction => {
  const {
    fullname: _fullname,
    voluntaryRole: _voluntaryRole,
    ...updatePayload
  } = state;
  if (!updatePayload.uuid || !regexUuid.test(updatePayload.uuid)) {
    throw new Error("UUID is required to update the voluntary role");
  }
  if (
    !updatePayload.functionUuid ||
    !regexUuid.test(updatePayload.functionUuid)
  ) {
    throw new Error("UUID is required to update the voluntary role");
  }
  return updatePayload as UpdateVoluntaryFunction;
};

export const updateVoluntaryRolePayload = (
  state: UpdateVoluntaryFunction & UpdateVoluntaryRole & { fullname: string },
): UpdateVoluntaryRole => {
  const {
    fullname: _fullname,
    functionUuid: _functionUuid,
    ...updatePayload
  } = state;
  if (!updatePayload.uuid || !regexUuid.test(updatePayload.uuid)) {
    throw new Error("UUID is required to update the voluntary role");
  }
  return updatePayload as UpdateVoluntaryRole;
};
