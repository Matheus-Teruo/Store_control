import styles from "./FormTag.module.scss";
import {
  isMessage,
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import Tag from "@data/stands/Tag";
import {
  createTagPayload,
  initialTagState,
  tagReducer,
  updateTagPayload,
} from "@reducer/stand/tagReducer";
import Input from "@/components/utils/ProductInput";
import useTagService from "@service/stand/useTagService";
import { useEffect, useReducer, useState } from "react";
import Button from "@/components/utils/Button";
import { CheckSVG, XSVG } from "@/assets/svg";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import GlassBackground from "@/components/GlassBackground";
import ColorSelect from "@/components/selects/ColorSelect";

type FormTagProps = {
  type: "create" | "update";
  hide: () => void;
  tag?: Tag;
};

function FormTag({ type, hide, tag }: FormTagProps) {
  const [state, dispatch] = useReducer(tagReducer, initialTagState);
  const [initial, setInitial] = useState<Tag>();
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [waitingFetch, setWaitingFetch] = useState<
    "create/update" | "delete" | ""
  >("");
  const [touched, setTouched] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<Record<string, string>>({});
  const { addNotification } = useAlertsContext();
  const { createTag, updateTag, deleteTag } = useTagService();

  useEffect(() => {
    if (type === "update" && tag) {
      dispatch({ type: "SET_TAG", payload: tag });
      setInitial(tag);
    } else if (type === "update" && tag === undefined) {
      console.error("uuid need to be defined when type is update");
    }
  }, [tag, type]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitingFetch("create/update");
    setTouched(false);
    const tag = await createTag(createTagPayload(state));
    if (tag && !isMessage(tag)) {
      addNotification({
        title: "Create Tag Success",
        message: `Create tag: ${tag.tagName}, with color: ${tag.color}`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
      hide();
    } else if (isMessage(tag)) {
      const message = tag;
      if (message.invalidFields) setMessageError(message.invalidFields);
    }
    setTouched(true);
    setWaitingFetch("");
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initial) {
      setWaitingFetch("create/update");
      setTouched(false);
      const tag = await updateTag(updateTagPayload(state, initial));
      if (tag && !isMessage(tag)) {
        addNotification({
          title: "Update Tag Success",
          message: `Update tag: ${tag.tagName}, with color: ${tag.color}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      } else if (isMessage(tag)) {
        const message = tag;
        if (message.invalidFields) setMessageError(message.invalidFields);
      }
    }
    setTouched(true);
    setWaitingFetch("");
  };

  const handleDeleteSubmit = async () => {
    if (tag) {
      setWaitingFetch("delete");
      await deleteTag(state.uuid);
      addNotification({
        title: "Delete Tag Success",
        message: `Delete tag: ${state.tagName}`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
      setConfirmDelete(false);
      hide();
    }
    setWaitingFetch("");
  };

  return (
    <>
      <div className={styles.main}>
        <h3>{type === "create" ? "Criar Tag" : "Editar Tag"}</h3>
        <form
          onSubmit={type === "create" ? handleCreateSubmit : handleUpdateSubmit}
        >
          <label>Nome da tag</label>
          <Input
            type="text"
            id="tagName"
            value={state.tagName}
            onChange={(e) =>
              dispatch({ type: "SET_TAG_NAME", payload: e.target.value })
            }
            showStatus={touched}
            message={messageError["tagName"]}
            isRequired
          />
          <label>Cor</label>
          <ColorSelect
            value={state.color}
            onChange={(e) =>
              dispatch({
                type: "SET_COLOR",
                payload: e.target.value,
              })
            }
            showStatus={touched}
            message={messageError["color"]}
          />
          <div className={styles.footerButtons}>
            {type === "update" && !confirmDelete && (
              <Button onClick={() => setConfirmDelete(true)}>Excluir</Button>
            )}
            {confirmDelete && (
              <div className={styles.deleteBody}>
                <span>Excluir?</span>
                <Button
                  className={styles.buttonCancelDelete}
                  onClick={() => setConfirmDelete(false)}
                >
                  <XSVG size={16} />
                </Button>
                <Button
                  className={styles.buttonConfirmDelete}
                  onClick={handleDeleteSubmit}
                  loading={waitingFetch === "delete"}
                >
                  <CheckSVG size={16} />
                </Button>
              </div>
            )}
            <div />
            <Button
              type={ButtonHTMLType.Submit}
              loading={waitingFetch === "create/update"}
            >
              {type === "create" ? "Criar" : "Editar"}
            </Button>
          </div>
        </form>
      </div>
      <GlassBackground onClick={hide} />
    </>
  );
}

export default FormTag;
