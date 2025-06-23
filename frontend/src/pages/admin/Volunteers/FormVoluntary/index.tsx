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
import { CheckSVG, XSVG } from "@/assets/svg";
import { VoluntaryRoleMetadata } from "@/components/selects/RoleSelect/voluntaryRoleMetadata";

type FormVoluntaryProps = {
  hide: () => void;
  uuid?: string;
  association?: string;
  isAdminPermition?: boolean;
};

function FormVoluntary({
  hide,
  uuid,
  association,
  isAdminPermition = false,
}: FormVoluntaryProps) {
  const [state, dispatch] = useReducer(voluntaryReducer, initialVoluntaryState);
  const [waitingFetch, setWaitingFetch] = useState<
    "function" | "role" | "forgotPassword" | "delete" | ""
  >("");
  const [confirm, setConfirm] = useState<"forgotPassword" | "delete" | "">("");
  const [messageError, setMessageError] = useState<Record<string, string>>({});
  const { addNotification } = useAlertsContext();
  const {
    getVoluntary,
    updateVoluntaryFunction,
    updateVoluntaryRole,
    updatePassword,
    deleteVoluntary,
  } = useVoluntaryService();

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

  const handleForgotPasswordSubmit = async () => {
    if (uuid) {
      setWaitingFetch("delete");
      const voluntary = await updatePassword(state.uuid);
      if (voluntary && !isMessage(voluntary)) {
        addNotification({
          title: "Updated Password Success",
          message: `Updated password to username: ${voluntary.username}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      } else if (voluntary) {
        const message = voluntary;
        if (message.invalidFields) setMessageError(message.invalidFields);
      }
      setConfirm("");
    }
    setWaitingFetch("");
  };

  const handleDeleteSubmit = async () => {
    if (uuid) {
      setWaitingFetch("delete");
      await deleteVoluntary(state.uuid);
      addNotification({
        title: "Delete Voluntary Success",
        message: `Delete voluntary ${state.fullname}`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
      setConfirm("");
      hide();
    }
    setWaitingFetch("");
  };

  return (
    <>
      <div className={styles.main}>
        <h3>Voluntário</h3>
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
              value={state.functionUuid !== null ? state.functionUuid : ""}
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
        {isAdminPermition ? (
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
        ) : (
          <>
            <label>Permissão</label>
            <p>{VoluntaryRoleMetadata[state.voluntaryRole].label}</p>
          </>
        )}
        <div className={styles.buttonsOptions}>
          {isAdminPermition &&
            (confirm === "forgotPassword" ? (
              <>
                <Button onClick={() => setConfirm("")}>
                  <XSVG size={16} />
                </Button>
                <span>Mudar senha?</span>
                <Button
                  onClick={handleForgotPasswordSubmit}
                  loading={waitingFetch === "delete"}
                >
                  <CheckSVG size={16} />
                </Button>
              </>
            ) : confirm === "delete" ? (
              <>
                <Button
                  className={styles.buttonCancel}
                  onClick={() => setConfirm("")}
                >
                  <XSVG size={16} />
                </Button>
                <span>Excluir?</span>
                <Button
                  className={styles.buttonConfirm}
                  onClick={handleDeleteSubmit}
                  loading={waitingFetch === "delete"}
                >
                  <CheckSVG size={16} />
                </Button>
              </>
            ) : (
              <>
                <Button
                  loading={waitingFetch === "delete"}
                  onClick={() => setConfirm("delete")}
                >
                  Deletar Voluntário
                </Button>
                <Button
                  loading={waitingFetch === "forgotPassword"}
                  onClick={() => setConfirm("forgotPassword")}
                >
                  Mudar Senha
                </Button>
              </>
            ))}
        </div>
      </div>
      <GlassBackground onClick={hide} />
    </>
  );
}

export default FormVoluntary;
