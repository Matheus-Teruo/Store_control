import styles from "./Signup.module.scss";
import Button from "@/components/utils/Button";
import Input from "@/components/utils/Input";
import { useState } from "react";
import { signupVoluntary } from "@service/userService";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import {
  MessageType,
  useAlertsContext,
} from "@/context/AlertsContext/useUserContext";
import { isAxiosError } from "axios";

function Signup() {
  const [username, setUsername] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { addNotification } = useAlertsContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        await signupVoluntary({ username, fullname, password });
        addNotification({
          title: "Signup Success",
          message: `Create user ${username} and logged`,
          type: MessageType.OK,
        });
        setUsername("");
        setFullname("");
        setPassword("");
        setConfirmPassword("");
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
    }
  };

  function handleUsername(event: React.ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }

  function handleFullname(event: React.ChangeEvent<HTMLInputElement>) {
    setFullname(event.target.value);
  }

  function handlePassword(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  function handleConfirmPassword(event: React.ChangeEvent<HTMLInputElement>) {
    setConfirmPassword(event.target.value);
  }

  return (
    <>
      <h1 className={styles.title}>Cadastrar</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          value={username}
          onChange={handleUsername}
          id="username"
          placeholder="Usuário"
          isRequired
        />
        <Input
          value={fullname}
          onChange={handleFullname}
          id="fullname"
          placeholder="Nome Completo"
          isRequired
        />
        <Input
          value={password}
          onChange={handlePassword}
          id="password"
          placeholder="Senha"
          isSecret
          isRequired
        />
        <Input
          value={confirmPassword}
          onChange={handleConfirmPassword}
          id="confirmPassword"
          placeholder="Confirmar Senha"
          isSecret
          isRequired
        />
        <div className={styles.button}>
          <Button type={ButtonHTMLType.Submit}>Login</Button>
        </div>
      </form>
    </>
  );
}

export default Signup;
