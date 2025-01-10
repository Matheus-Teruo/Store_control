import { useEffect, useState } from "react";
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
  const [newUsername, setNewUsername] = useState<string>("");
  const [newFullname, setNewFullname] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [updateUsername, setUpdateUsername] = useState<boolean>(false);
  const [updateFullname, setUpdateFullname] = useState<boolean>(false);
  const [updatePassword, setUpdatePassword] = useState<boolean>(false);
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
        username: updateUsername ? newUsername : undefined,
        password: updatePassword ? newPassword : undefined,
        fullname: updateFullname ? newFullname : undefined,
      });
      addNotification({
        title: "Update Success",
        message: `Update ${updateUsername ? newUsername : ""}
        ${updateFullname ? newFullname : ""}
        ${updatePassword ? newPassword : ""}`,
        type: MessageType.OK,
      });
      setNewUsername("");
      setUpdateUsername(false);
      setNewFullname("");
      setUpdateFullname(false);
      setNewPassword("");
      setUpdatePassword(false);
      setUserProperties(voluntary);
    } catch (error) {
      handleApiError(error);
    }
  };

  function handleUsername(event: React.ChangeEvent<HTMLInputElement>) {
    setNewUsername(event.target.value);
  }
  function handleFullname(event: React.ChangeEvent<HTMLInputElement>) {
    setNewFullname(event.target.value);
  }
  function handlePassword(event: React.ChangeEvent<HTMLInputElement>) {
    setNewPassword(event.target.value);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <p>Usuário</p>
          {!updateUsername ? (
            <p onClick={() => setUpdateUsername(true)}>
              {userProperties.username}
            </p>
          ) : (
            <Input
              value={newUsername}
              onChange={handleUsername}
              id="password"
              placeholder="Novo Usuário"
              isRequired
            />
          )}
        </div>
        <div>
          <p>Nome Completo</p>
          {!updateFullname ? (
            <p onClick={() => setUpdateFullname(true)}>
              {userProperties.fullname}
            </p>
          ) : (
            <Input
              value={newFullname}
              onChange={handleFullname}
              id="password"
              placeholder="Novo Nome Completo"
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
          {!updatePassword ? (
            <Button onClick={() => setUpdatePassword(true)}>
              Alterar Senha
            </Button>
          ) : (
            <>
              <p>Editar Senha</p>
              <Input
                value={newPassword}
                onChange={handlePassword}
                id="password"
                placeholder="Nova Senha"
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
