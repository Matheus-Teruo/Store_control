import { regexLeterNumberSpace, regexUuid } from "@/utils/regex";
import Tag, { CreateTag, UpdateTag } from "@data/stands/Tag";

type TagAction =
  | { type: "SET_TAG"; payload: Tag }
  | { type: "SET_TAG_NAME"; payload: string }
  | { type: "SET_COLOR"; payload: string }
  | { type: "RESET" };

export const initialTagState: CreateTag & UpdateTag = {
  uuid: "",
  tagName: "",
  color: "#000000",
};

export function tagReducer(
  state: CreateTag & UpdateTag,
  action: TagAction,
): CreateTag & UpdateTag {
  switch (action.type) {
    case "SET_TAG": {
      return {
        uuid: action.payload.uuid,
        tagName: action.payload.tagName,
        color: action.payload.color,
      };
    }
    case "SET_TAG_NAME": {
      if (!regexLeterNumberSpace.test(action.payload)) {
        return state;
      }
      return { ...state, tagName: action.payload };
    }
    case "SET_COLOR": {
      return { ...state, color: action.payload };
    }
    case "RESET": {
      return initialTagState;
    }
    default:
      throw new Error("Unknown action in stand reducer");
  }
}

export const createTagPayload = (
  state: CreateTag & Partial<UpdateTag>,
): CreateTag => {
  const { uuid: _uuid, ...createPayload } = state;
  return createPayload;
};

export const updateTagPayload = (
  state: CreateTag & Partial<UpdateTag>,
  initial: Tag,
): UpdateTag => {
  const { uuid, tagName, ...rest } = state;
  if (!uuid || !regexUuid.test(uuid)) {
    throw new Error("UUID is required to update the stand");
  }

  if (tagName === initial.tagName) {
    return { ...rest, uuid };
  }

  return { ...rest, tagName, uuid };
};
