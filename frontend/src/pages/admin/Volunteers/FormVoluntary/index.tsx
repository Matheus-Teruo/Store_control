import { useHandleApiError } from "@/axios/handlerApiError";
import Button from "@/components/utils/Button";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import { isAdmin, isUserLogged } from "@/utils/checkAuthentication";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useUserContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import {
  initialVoluntaryState,
  updateVoluntaryFunctionPayload,
  updateVoluntaryRolePayload,
  voluntaryReducer,
} from "@reducer/voluntaryReducer";
import {
  getVoluntary,
  updateVoluntaryFunction,
  updateVoluntaryRole,
} from "@service/voluntary/voluntaryService";
import { useEffect, useReducer } from "react";
import FunctionSelect from "../FunctionSelect";
import RoleSelect from "../RoleSelect";

type FormVoluntaryProps = {
  hide: () => void;
  uuid?: string;
};

function FormVoluntary({ hide, uuid }: FormVoluntaryProps) {
  const [state, dispatch] = useReducer(voluntaryReducer, initialVoluntaryState);
  const { addNotification } = useAlertsContext();
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();

  useEffect(() => {
    const fetchAssociation = async () => {
      if (uuid && isUserLogged(user) && isAdmin(user)) {
        try {
          const voluntary = await getVoluntary(uuid);
          dispatch({ type: "SET_VOLUNTARY", payload: voluntary });
        } catch (error) {
          handleApiError(error);
        }
      } else if (uuid === undefined) {
        console.error("uuid need to be defined when type is update");
      }
    };

    fetchAssociation();
  }, [uuid, user, handleApiError]);

  const handleUpdateFunctionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUserLogged(user) && isAdmin(user)) {
      try {
        const voluntary = await updateVoluntaryFunction(
          updateVoluntaryFunctionPayload(state),
        );
        addNotification({
          title: "Update Voluntary Function Success",
          message: `Update voluntary ${voluntary.fullname} to function: ${voluntary.summaryFunction}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      } catch (error) {
        handleApiError(error);
      }
    }
  };

  const handleUpdateRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uuid && isUserLogged(user) && isAdmin(user)) {
      try {
        const voluntary = await updateVoluntaryRole(
          updateVoluntaryRolePayload(state),
        );
        addNotification({
          title: "Update Voluntary Role Success",
          message: `Update voluntary ${voluntary.fullname} to role: ${voluntary.voluntaryRole}`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
        hide();
      } catch (error) {
        handleApiError(error);
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
            dispatch({ type: "SET_ROLE", payload: e.target.value })
          }
        />
        <Button type={ButtonHTMLType.Submit}>Editar</Button>
      </form>
    </div>
  );
}

export default FormVoluntary;
