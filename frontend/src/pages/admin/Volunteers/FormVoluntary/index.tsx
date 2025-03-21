import styles from "./FormVoluntary.module.scss";
import Button from "@/components/utils/Button";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import {
  isMessage,
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import {
  initialVoluntaryState,
  updateVoluntaryFunctionPayload,
  updateVoluntaryRolePayload,
  voluntaryReducer,
} from "@reducer/voluntary/voluntaryReducer";
import useVoluntaryService from "@service/voluntary/useVoluntaryService";
import { useEffect, useReducer, useState } from "react";
import FunctionSelect from "../../../../components/selects/FunctionSelect";
import RoleSelect from "../../../../components/selects/RoleSelect";
import { VoluntaryRole } from "@data/volunteers/Voluntary";
import GlassBackground from "@/components/GlassBackground";

type FormVoluntaryProps = {
  hide: () => void;
  uuid?: string;
  association?: string;
};

function FormVoluntary({ hide, uuid, association }: FormVoluntaryProps) {
  const [state, dispatch] = useReducer(voluntaryReducer, initialVoluntaryState);
  const [waitingFetch, setWaitingFetch] = useState<"function" | "role" | "">(
    "",
  );
  const [messageError, setMessageError] = useState<Record<string, string>>({});
  const { addNotification } = useAlertsContext();
  const { getVoluntary, updateVoluntaryFunction, updateVoluntaryRole } =
    useVoluntaryService();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (uuid) {
        const voluntary = await getVoluntary(uuid);
        if (voluntary) {
          dispatch({ type: "SET_VOLUNTARY", payload: voluntary });
        }
      } else if (uuid === undefined) {
        console.error("uuid need to be defined when type is update");
      }
    };

    fetchVoluntary();
  }, [uuid, getVoluntary]);

  const handleUpdateFunctionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitingFetch("function");
    const voluntary = await updateVoluntaryFunction(
      updateVoluntaryFunctionPayload(state),
    );
    if (voluntary && !isMessage(voluntary)) {
      addNotification({
        title: "Update Voluntary Function Success",
        message: `Update voluntary ${voluntary.fullname} to function: ${voluntary.summaryFunction}`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
      hide();
    } else if (voluntary) {
      const message = voluntary;
      if (message.invalidFields) setMessageError(message.invalidFields);
    }
    setWaitingFetch("");
  };

  const handleUpdateRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uuid) {
      setWaitingFetch("role");
      const voluntary = await updateVoluntaryRole(
        updateVoluntaryRolePayload(state),
      );
      if (voluntary && !isMessage(voluntary)) {
        addNotification({
          title: "Update Voluntary Role Success",
          message: `Update voluntary ${voluntary.fullname} to role: ${voluntary.voluntaryRole}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      } else if (voluntary) {
        const message = voluntary;
        if (message.invalidFields) setMessageError(message.invalidFields);
      }
    }
    setWaitingFetch("");
  };

  return (
    <>
      <div className={styles.main}>
        <label>Nome completo</label>
        <p>{state.fullname}</p>
        <label>Associação</label>
        <p className={`${!association && styles.nullAssociation}`}>
          {association ? association : "Não possui associação"}
        </p>
        <form onSubmit={handleUpdateFunctionSubmit}>
          <div className={styles.field}>
            <label>Função</label>
            <FunctionSelect
              value={state.functionUuid}
              onChange={(e) =>
                dispatch({ type: "SET_FUNCTION", payload: e.target.value })
              }
              message={messageError["functionUuid"]}
            />
          </div>
          <Button
            type={ButtonHTMLType.Submit}
            loading={waitingFetch === "function"}
          >
            Editar
          </Button>
        </form>
        <form onSubmit={handleUpdateRoleSubmit}>
          <div className={styles.field}>
            <label>Permissão</label>
            <RoleSelect
              value={state.voluntaryRole}
              onChange={(e) =>
                dispatch({
                  type: "SET_ROLE",
                  payload: e.target.value as VoluntaryRole,
                })
              }
              message={messageError["voluntaryRole"]}
            />
          </div>
          <Button
            type={ButtonHTMLType.Submit}
            loading={waitingFetch === "role"}
          >
            Editar
          </Button>
        </form>
      </div>
      <GlassBackground onClick={hide} />
    </>
  );
}

export default FormVoluntary;
