import { useEffect, useState } from "react";
import Button from "@/components/utils/Button";
import Input from "@/components/utils/Input";
import { getVoluntary } from "@service/voluntaryService";
import Voluntary, { VoluntaryRole } from "@/data/volunteers/Voluntary";
import { useUserContext } from "@context/UserContext/useUserContext";
import { useNavigate } from "react-router-dom";
import { useHandleApiError } from "@/axios/handlerApiError";

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
  const { user } = useUserContext();
  const handleApiError = useHandleApiError();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (user) {
        if (user !== "unlogged") {
          try {
            const voluntary = await getVoluntary(user.uuid);
            setUserProperties(voluntary);
          } catch (error) {
            handleApiError(error);
          }
        } else {
          navigate("/");
        }
      }
    };
    fetchVoluntary();
  }, [user, navigate, handleApiError]);

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
      <form>
        <div>
          <p>Usuário</p>
          {!updateUsername ? (
            <p onClick={() => setUpdateUsername}>{userProperties.username}</p>
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
            <p onClick={() => setUpdateFullname}>{userProperties.fullname}</p>
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
          {/* Por algum motivo BIZARRO não tem como fazer de forma melhor */}
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
