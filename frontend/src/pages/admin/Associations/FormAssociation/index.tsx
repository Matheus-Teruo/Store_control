import { useHandleApiError } from "@/axios/handlerApiError";
import Button from "@/components/utils/Button";
import { isAdmin, isUserLogged } from "@/utils/checkAuthentication";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useUserContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import {
  associationReducer,
  createAssociationPayload,
  initialAssociationState,
  updateAssociationPayload,
} from "@reducer/associationReducer";
import {
  createAssociation,
  deleteAssociation,
  getAssociation,
  updateAssociation,
} from "@service/stand/associationService";
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
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();

  useEffect(() => {
    const fetchAssociation = async () => {
      if (type === "update" && uuid && isUserLogged(user) && isAdmin(user)) {
        try {
          const association = await getAssociation(uuid);
          dispatch({ type: "SET_ASSOCIATION", payload: association });
        } catch (error) {
          handleApiError(error);
        }
      } else if (uuid === undefined) {
        console.error("uuid need to be defined when type is update");
      }
    };

    fetchAssociation();
  }, [uuid, type, user, handleApiError]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUserLogged(user) && isAdmin(user)) {
      try {
        const association = await createAssociation(
          createAssociationPayload(state),
        );
        addNotification({
          title: "Create Association Success",
          message: `Create associatione: ${association.associationName}, with president: ${association.principalName}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uuid && isUserLogged(user) && isAdmin(user)) {
      try {
        const association = await updateAssociation(
          updateAssociationPayload(state),
        );
        addNotification({
          title: "Update Association Success",
          message: `Update association: ${association.associationName}, with president: ${association.principalName}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const handleDeleteSubmit = async () => {
    if (uuid && isUserLogged(user) && isAdmin(user)) {
      try {
        await deleteAssociation(state.uuid);
        addNotification({
          title: "Delete Association Success",
          message: `Delete association ${state.associationName}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        setConfirmDelete(false);
        hide();
      } catch (error) {
        handleApiError(error);
      }
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
