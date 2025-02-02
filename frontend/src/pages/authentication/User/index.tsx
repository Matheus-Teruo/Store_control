import { useEffect, useReducer, useState } from "react";
import Button from "@/components/utils/Button";
import Input from "@/components/utils/Input";
import useVoluntaryService from "@service/voluntary/useVoluntaryService";
import Voluntary, { VoluntaryRole } from "@/data/volunteers/Voluntary";
import { useUserContext } from "@context/UserContext/useUserContext";
import { useNavigate } from "react-router-dom";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { isUserLogged, isUserUnlogged } from "@/utils/checkAuthentication";
import { initialUserState, userReducer } from "@reducer/voluntary/userReducer";

const voluntaryInitialValue: Voluntary = {
  uuid: "",
  username: "username",
  fullname: "fullname",
  summaryFunction: undefined,
  voluntaryRole: VoluntaryRole.VOLUNTARY,
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
  const { getVoluntary, updateVoluntary } = useVoluntaryService();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (isUserLogged(user)) {
        const voluntary = await getVoluntary(user.uuid);
        if (voluntary) {
          setUserProperties(voluntary);
        }
      } else if (isUserUnlogged(user)) {
        navigate("/");
      }
    };
    fetchVoluntary();
  }, [user, navigate, getVoluntary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const voluntary = await updateVoluntary({
      uuid: userProperties.uuid,
      username: update === "username" ? state.username : undefined,
      password: update === "password" ? state.password : undefined,
      fullname: update === "fullname" ? state.fullname : undefined,
    });
    if (voluntary) {
      addNotification({
        title: "Update Success",
        message: `Update ${update}: ${update === "username" ? state.username : update === "password" ? "successful" : update === "fullname" ? state.fullname : ""}`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
      setUpdate("");
      setUserProperties(voluntary);
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
          {userProperties.voluntaryRole === VoluntaryRole.VOLUNTARY ? (
            <p>Usuário Voluntário</p>
          ) : userProperties.voluntaryRole === VoluntaryRole.MANAGEMENT ? (
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
