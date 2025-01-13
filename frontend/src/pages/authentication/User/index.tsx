import { useEffect, useReducer, useState } from "react";
import Button from "@/components/utils/Button";
import Input from "@/components/utils/Input";
import {
  getVoluntary,
  updateVoluntary,
} from "@service/voluntary/voluntaryService";
import Voluntary, { VoluntaryRole } from "@/data/volunteers/Voluntary";
import { useUserContext } from "@context/UserContext/useUserContext";
import { useNavigate } from "react-router-dom";
import { useHandleApiError } from "@/axios/handlerApiError";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useUserContext";
import { isUserLogged, isUserUnlogged } from "@/utils/checkAuthentication";
import { initialUserState, userReducer } from "@reducer/userReducer";

const voluntaryInitialValue: Voluntary = {
  uuid: "",
  username: "username",
  fullname: "fullname",
  summaryFunction: null,
  voluntaryRole: VoluntaryRole.ROLE_USER,
};

function User() {
  const [userProperties, setUserProperties] = useState<Voluntary>(
    voluntaryInitialValue,
  );
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const [update, setUpdate] = useState<
    "username" | "fullname" | "password" | ""
  >("");
  const { addNotification } = useAlertsContext();
  const { user } = useUserContext();
  const handleApiError = useHandleApiError();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (isUserLogged(user)) {
        try {
          const voluntary = await getVoluntary(user.uuid);
          setUserProperties(voluntary);
        } catch (error) {
          handleApiError(error);
        }
      } else if (isUserUnlogged(user)) {
        navigate("/");
      }
    };
    fetchVoluntary();
  }, [user, navigate, handleApiError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const voluntary = await updateVoluntary({
        uuid: userProperties.uuid,
        username: update === "username" ? state.username : undefined,
        password: update === "password" ? state.password : undefined,
        fullname: update === "fullname" ? state.fullname : undefined,
      });
      addNotification({
        title: "Update Success",
        message: `Update ${update}: ${update === "username" ? state.username : update === "password" ? "successful" : update === "fullname" ? state.fullname : ""}`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
      setUpdate("");
      setUserProperties(voluntary);
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <p>Usuário</p>
          {update !== "username" ? (
            <p onClick={() => setUpdate("fullname")}>
              {userProperties.username}
            </p>
          ) : (
            <Input
              value={state.username}
              onChange={(e) =>
                dispatch({ type: "SET_USERNAME", payload: e.target.value })
              }
              id="username"
              placeholder="Alterar Usuário"
              isRequired
            />
          )}
        </div>
        <div>
          <p>Nome Completo</p>
          {update !== "fullname" ? (
            <p onClick={() => setUpdate("fullname")}>
              {userProperties.fullname}
            </p>
          ) : (
            <Input
              value={state.fullname}
              onChange={(e) =>
                dispatch({ type: "SET_FULLNAME", payload: e.target.value })
              }
              id="fullname"
              placeholder="Alterar Nome Completo"
              isRequired
            />
          )}
        </div>
        <div>
          <p>Função</p>
          {userProperties.summaryFunction ? (
            <>
              <p>{userProperties.summaryFunction.typeOfFunction}</p>
              <p>{userProperties.summaryFunction.functionName}</p>
            </>
          ) : (
            <p></p>
          )}
        </div>
        <div>
          <p>Permissão</p>
          {/* TODO: otimizar forma de visualizar enum */}
          {userProperties.voluntaryRole === VoluntaryRole.ROLE_USER ? (
            <p>Usuário Voluntário</p>
          ) : userProperties.voluntaryRole === VoluntaryRole.ROLE_MANAGEMENT ? (
            <p>Gestor</p>
          ) : (
            <p>Administrador</p>
          )}
        </div>
        <div>
          {update !== "password" ? (
            <Button onClick={() => setUpdate("password")}>Alterar Senha</Button>
          ) : (
            <>
              <p>Editar Senha</p>
              <Input
                value={state.password}
                onChange={(e) =>
                  dispatch({ type: "SET_PASSWORD", payload: e.target.value })
                }
                id="password"
                placeholder="Nova Senha"
                isRequired
              />
              <Input
                value={state.confirmPassword}
                onChange={(e) =>
                  dispatch({
                    type: "SET_CONFIRM_PASSWORD",
                    payload: e.target.value,
                  })
                }
                id="confirmPassword"
                placeholder="Confirmar Nova Senha"
                isRequired
              />
            </>
          )}
        </div>
      </form>
    </div>
  );
}

export default User;
