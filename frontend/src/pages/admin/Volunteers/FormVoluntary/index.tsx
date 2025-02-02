import Button from "@/components/utils/Button";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import { isAdmin, isUserLogged } from "@/utils/checkAuthentication";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import {
  initialVoluntaryState,
  updateVoluntaryFunctionPayload,
  updateVoluntaryRolePayload,
  voluntaryReducer,
} from "@reducer/voluntary/voluntaryReducer";
import useVoluntaryService from "@service/voluntary/useVoluntaryService";
import { useEffect, useReducer } from "react";
import FunctionSelect from "../FunctionSelect";
import RoleSelect from "../RoleSelect";
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
  const { user } = useUserContext();

  useEffect(() => {
    const fetchAssociation = async () => {
      if (uuid && isUserLogged(user) && isAdmin(user)) {
        const voluntary = await getVoluntary(uuid);
        if (voluntary) {
          dispatch({ type: "SET_VOLUNTARY", payload: voluntary });
        }
      } else if (uuid === undefined) {
        console.error("uuid need to be defined when type is update");
      }
    };

    fetchAssociation();
  }, [uuid, user, getVoluntary]);

  const handleUpdateFunctionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUserLogged(user) && isAdmin(user)) {
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
    }
  };

  const handleUpdateRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uuid && isUserLogged(user) && isAdmin(user)) {
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
    <div>
      <label>Nome do Voluntario</label>
      <p>{state.fullname}</p>
      <form onSubmit={handleUpdateFunctionSubmit}>
        <label>Função:</label>
        <FunctionSelect
          value={state.functionUuid}
          onChange={(e) =>
            dispatch({ type: "SET_FUNCTION", payload: e.target.value })
          }
        />
        <Button type={ButtonHTMLType.Submit}>Editar</Button>
      </form>
      <form onSubmit={handleUpdateRoleSubmit}>
        <label>Permissão:</label>
        <RoleSelect
          value={state.voluntaryRole}
          onChange={(e) =>
            dispatch({
              type: "SET_ROLE",
              payload: e.target.value as VoluntaryRole,
            })
          }
        />
        <Button type={ButtonHTMLType.Submit}>Editar</Button>
      </form>
    </div>
  );
}

export default FormVoluntary;
