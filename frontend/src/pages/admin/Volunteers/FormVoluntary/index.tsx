import styles from "./FormVoluntary.module.scss";
import Button from "@/components/utils/Button";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import {
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
import { useEffect, useReducer } from "react";
import FunctionSelect from "../../../../components/selects/FunctionSelect";
import RoleSelect from "../../../../components/selects/RoleSelect";
import { VoluntaryRole } from "@data/volunteers/Voluntary";

type FormVoluntaryProps = {
  hide: () => void;
  uuid?: string;
};

function FormVoluntary({ hide, uuid }: FormVoluntaryProps) {
  const [state, dispatch] = useReducer(voluntaryReducer, initialVoluntaryState);
  const { addNotification } = useAlertsContext();
  const { getVoluntary, updateVoluntaryFunction, updateVoluntaryRole } =
    useVoluntaryService();

  useEffect(() => {
    const fetchAssociation = async () => {
      if (uuid) {
        const voluntary = await getVoluntary(uuid);
        if (voluntary) {
          dispatch({ type: "SET_VOLUNTARY", payload: voluntary });
        }
      } else if (uuid === undefined) {
        console.error("uuid need to be defined when type is update");
      }
    };

    fetchAssociation();
  }, [uuid, getVoluntary]);

  const handleUpdateFunctionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const voluntary = await updateVoluntaryFunction(
      updateVoluntaryFunctionPayload(state),
    );
    if (voluntary) {
      addNotification({
        title: "Update Voluntary Function Success",
        message: `Update voluntary ${voluntary.fullname} to function: ${voluntary.summaryFunction}`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
      hide();
    }
  };

  const handleUpdateRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uuid) {
      const voluntary = await updateVoluntaryRole(
        updateVoluntaryRolePayload(state),
      );
      if (voluntary) {
        addNotification({
          title: "Update Voluntary Role Success",
          message: `Update voluntary ${voluntary.fullname} to role: ${voluntary.voluntaryRole}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      }
    }
  };

  return (
    <div className={styles.main}>
      <label>Nome completo</label>
      <p>{state.fullname}</p>
      <form onSubmit={handleUpdateFunctionSubmit}>
        <div className={styles.field}>
          <label>Função</label>
          <FunctionSelect
            value={state.functionUuid}
            onChange={(e) =>
              dispatch({ type: "SET_FUNCTION", payload: e.target.value })
            }
          />
        </div>
        <Button type={ButtonHTMLType.Submit}>Editar</Button>
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
          />
        </div>
        <Button type={ButtonHTMLType.Submit}>Editar</Button>
      </form>
    </div>
  );
}

export default FormVoluntary;
