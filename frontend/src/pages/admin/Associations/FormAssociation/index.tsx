import styles from "./FormAssociation.module.scss";
import Button from "@/components/utils/Button";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import {
  isMessage,
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import {
  associationReducer,
  createAssociationPayload,
  initialAssociationState,
  updateAssociationPayload,
} from "@reducer/stand/associationReducer";
import Input from "@/components/utils/ProductInput";
import useAssociationService from "@service/stand/useAssociationService";
import { useEffect, useReducer, useState } from "react";
import { CheckSVG, XSVG } from "@/assets/svg";
import GlassBackground from "@/components/GlassBackground";

type FormAssociationProps = {
  type: "create" | "update";
  hide: () => void;
  uuid?: string;
};

function FormAssociation({ type, hide, uuid }: FormAssociationProps) {
  const [state, dispatch] = useReducer(
    associationReducer,
    initialAssociationState,
  );
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<Record<string, string>>({});
  const { addNotification } = useAlertsContext();
  const {
    getAssociation,
    createAssociation,
    updateAssociation,
    deleteAssociation,
  } = useAssociationService();
  const { user } = useUserContext();

  useEffect(() => {
    const fetchAssociation = async () => {
      if (type === "update" && uuid) {
        const association = await getAssociation(uuid);
        if (association) {
          dispatch({ type: "SET_ASSOCIATION", payload: association });
        }
      } else if (uuid === undefined) {
        console.error("uuid need to be defined when type is update");
      }
    };

    fetchAssociation();
  }, [uuid, type, user, getAssociation]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const association = await createAssociation(
      createAssociationPayload(state),
    );
    if (association && !isMessage(association)) {
      addNotification({
        title: "Create Association Success",
        message: `Create associatione: ${association.associationName}, with president: ${association.principalName}`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
      hide();
    } else if (isMessage(association)) {
      const message = association;
      if (message.invalidFields) setMessageError(message.invalidFields);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uuid) {
      const association = await updateAssociation(
        updateAssociationPayload(state),
      );
      if (association && !isMessage(association)) {
        addNotification({
          title: "Update Association Success",
          message: `Update association: ${association.associationName}, with president: ${association.principalName}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      } else if (isMessage(association)) {
        const message = association;
        if (message.invalidFields) setMessageError(message.invalidFields);
      }
    }
  };

  const handleDeleteSubmit = async () => {
    if (uuid) {
      await deleteAssociation(state.uuid);
      addNotification({
        title: "Delete Association Success",
        message: `Delete association ${state.associationName}`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
      setConfirmDelete(false);
      hide();
    }
  };

  return (
    <>
      <div className={styles.main}>
        <h3>{type === "create" ? "Criar Associação" : "Editar Associação"}</h3>
        <form
          onSubmit={type === "create" ? handleCreateSubmit : handleUpdateSubmit}
        >
          <label>Nome da Associação</label>
          <Input
            type="text"
            id="associationName"
            value={state.associationName}
            onChange={(e) =>
              dispatch({
                type: "SET_ASSOCIATION_NAME",
                payload: e.target.value,
              })
            }
            message={messageError["associationName"]}
          />
          <label>{"Nome do(a) presente"}</label>
          <Input
            type="text"
            id="principalName"
            value={state.principalName}
            onChange={(e) =>
              dispatch({ type: "SET_PRINCIPAL_NAME", payload: e.target.value })
            }
            message={messageError["principalName"]}
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
                >
                  <CheckSVG size={16} />
                </Button>
              </div>
            )}
            <div />
            <Button type={ButtonHTMLType.Submit}>
              {type === "create" ? "Criar" : "Editar"}
            </Button>
          </div>
        </form>
      </div>
      <GlassBackground onClick={hide} />
    </>
  );
}

export default FormAssociation;
