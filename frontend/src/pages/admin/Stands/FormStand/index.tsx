import Button from "@/components/utils/Button";
import { isAdmin, isUserLogged } from "@/utils/checkAuthentication";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import {
  createStandPayload,
  initialStandState,
  standReducer,
  updateStandPayload,
} from "@reducer/stand/standReducer";
import useStandService from "@service/stand/useStandService";
import { useEffect, useReducer, useState } from "react";
import AssociationSelect from "../AssociationSelect";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";

type FormStandProps = {
  type: "create" | "update";
  hide: () => void;
  uuid?: string;
};

function FormStand({ type, hide, uuid }: FormStandProps) {
  const [state, dispatch] = useReducer(standReducer, initialStandState);
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const { addNotification } = useAlertsContext();
  const { getStand, createStand, updateStand, deleteStand } = useStandService();
  const { user } = useUserContext();

  useEffect(() => {
    const fetchAssociation = async () => {
      if (type === "update" && uuid && isUserLogged(user) && isAdmin(user)) {
        const stand = await getStand(uuid);
        if (stand) {
          dispatch({ type: "SET_STAND", payload: stand });
        }
      } else if (uuid === undefined) {
        console.error("uuid need to be defined when type is update");
      }
    };

    fetchAssociation();
  }, [uuid, type, user, getStand]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUserLogged(user) && isAdmin(user)) {
      const stand = await createStand(createStandPayload(state));
      if (stand) {
        addNotification({
          title: "Create Stand Success",
          message: `Create stand: ${stand.standName}, with president: ${stand.association.associationName}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      }
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uuid && isUserLogged(user) && isAdmin(user)) {
      const stand = await updateStand(updateStandPayload(state));
      if (stand) {
        addNotification({
          title: "Update Stand Success",
          message: `Update stand: ${stand.standName}, with president: ${stand.association.associationName}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      }
    }
  };

  const handleDeleteSubmit = async () => {
    if (uuid && isUserLogged(user) && isAdmin(user)) {
      await deleteStand(state.uuid);
      addNotification({
        title: "Delete Stand Success",
        message: `Delete stand: ${state.standName}`,
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
        <label>Nome do estande</label>
        <input
          value={state.standName}
          onChange={(e) =>
            dispatch({ type: "SET_STAND_NAME", payload: e.target.value })
          }
        />
        <AssociationSelect
          value={state.associationUuid}
          onChange={(e) =>
            dispatch({ type: "SET_ASSOCIATION_UUID", payload: e.target.value })
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

export default FormStand;
