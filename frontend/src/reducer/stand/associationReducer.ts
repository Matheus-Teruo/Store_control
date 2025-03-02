import { regexLeterNumber, regexLeterSpace, regexUuid } from "@/utils/regex";
import Association, {
  CreateAssociation,
  UpdateAssociation,
} from "@data/stands/Association";

type AssociationAction =
  | { type: "SET_ASSOCIATION"; payload: Association }
  | { type: "SET_ASSOCIATION_NAME"; payload: string }
  | { type: "SET_PRINCIPAL_NAME"; payload: string }
  | { type: "SET_ASSOCIATION_KEY"; payload: string }
  | { type: "RESET" };

export const initialAssociationState: CreateAssociation & UpdateAssociation = {
  uuid: "",
  associationName: "",
  principalName: "",
  associationKey: "",
};

export function associationReducer(
  state: CreateAssociation & UpdateAssociation,
  action: AssociationAction,
): CreateAssociation & UpdateAssociation {
  switch (action.type) {
    case "SET_ASSOCIATION": {
      return {
        uuid: action.payload.uuid,
        associationName: action.payload.associationName,
        principalName: action.payload.principalName,
        associationKey: action.payload.associationKey,
      };
    }
    case "SET_ASSOCIATION_NAME": {
      if (!regexLeterSpace.test(action.payload)) {
        return state;
      }
      return { ...state, associationName: action.payload };
    }
    case "SET_PRINCIPAL_NAME": {
      if (!regexLeterSpace.test(action.payload)) {
        return state;
      }
      return { ...state, principalName: action.payload };
    }
    case "SET_ASSOCIATION_KEY": {
      if (!regexLeterNumber.test(action.payload)) {
        return state;
      }
      return { ...state, associationKey: action.payload };
    }
    case "RESET": {
      return initialAssociationState;
    }
    default:
      throw new Error("Unknown action in reducer");
  }
}

export const createAssociationPayload = (
  state: CreateAssociation & Partial<UpdateAssociation>,
): CreateAssociation => {
  const { uuid: _uuid, ...createPayload } = state;
  return createPayload;
};

export const updateAssociationPayload = (
  state: CreateAssociation & Partial<UpdateAssociation>,
): UpdateAssociation => {
  const { uuid, ...rest } = state;
  if (!uuid || !regexUuid.test(uuid)) {
    throw new Error("UUID is required to update the association");
  }
  return { ...rest, uuid };
};
