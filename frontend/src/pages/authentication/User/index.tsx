import { useEffect, useState } from "react";
import Button from "@/components/utils/Button";
import Input from "@/components/utils/Input";
import { getVoluntary } from "@service/voluntaryService";
import { isAxiosError } from "axios";
import {
  MessageType,
  useAlertsContext,
} from "@/context/AlertsContext/useUserContext";
import Voluntary, { VoluntaryRole } from "@/data/volunteers/Voluntary";

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

  useEffect(() => {
    const fetchVoluntary = async () => {
      try {
        const voluntary = await getVoluntary("a");
        setUserProperties(voluntary);
      } catch (error) {
        if (isAxiosError(error)) {
          addNotification({
            title: error.response?.data.error,
            message: error.response?.data.message,
            type: MessageType.WARNING,
          });
        } else {
          console.error("Erro desconhecido:", error);
        }
      }
    };
    fetchVoluntary();
  }, []);

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
