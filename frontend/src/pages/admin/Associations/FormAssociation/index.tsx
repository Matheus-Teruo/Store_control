import Button from "@/components/utils/Button";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import {
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
import useAssociationService from "@service/stand/useAssociationService";
import { useEffect, useReducer, useState } from "react";

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
    if (association) {
      addNotification({
        title: "Create Association Success",
        message: `Create associatione: ${association.associationName}, with president: ${association.principalName}`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
      hide();
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uuid) {
      const association = await updateAssociation(
        updateAssociationPayload(state),
      );
      if (association) {
        addNotification({
          title: "Update Association Success",
          message: `Update association: ${association.associationName}, with president: ${association.principalName}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
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
    <div>
      <form
        onSubmit={type === "create" ? handleCreateSubmit : handleUpdateSubmit}
      >
        <label>Nome da Associação</label>
        <input
          value={state.associationName}
          onChange={(e) =>
            dispatch({ type: "SET_ASSOCIATION_NAME", payload: e.target.value })
          }
        />
        <label>{"Nome do(a) presente"}</label>
        <input
          value={state.principalName}
          onChange={(e) =>
            dispatch({ type: "SET_PRINCIPAL_NAME", payload: e.target.value })
          }
        />
        <Button type={ButtonHTMLType.Submit}>
          {type === "create" ? "Criar" : "Editar"}
        </Button>
      </form>
      {type === "update" && !confirmDelete && (
        <Button onClick={() => setConfirmDelete(true)}>Excluir</Button>
      )}
      {confirmDelete && (
        <div>
          <p>Quer deletar essa associação?</p>
          <Button onClick={handleDeleteSubmit}>Excluir</Button>
        </div>
      )}
    </div>
  );
}

export default FormAssociation;
