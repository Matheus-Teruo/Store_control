import styles from "./Login.module.scss";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/utils/Button";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import Input from "@/components/utils/Input";
import { useState } from "react";
import useUserService from "@service/voluntary/useUserService";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { useUserContext } from "@context/UserContext/useUserContext";

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { addNotification } = useAlertsContext();
  const { login } = useUserContext();
  const { loginVoluntary } = useUserService();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await loginVoluntary({ username, password });
    if (user) {
      addNotification({
        title: "Login Success",
        message: `User ${username} logged`,
        type: MessageType.OK,
      });
      login(user);
      setUsername("");
      setPassword("");
      navigate("/workspace", { replace: true });
    }
  };

  function handleUsername(event: React.ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }

  function handlePassword(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  return (
    <>
      <h1 className={styles.title}>Entrar</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          value={username}
          onChange={handleUsername}
          id="username"
          placeholder="Usuário"
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
        <div className={styles.button}>
          <Button type={ButtonHTMLType.Submit}>Login</Button>
        </div>
      </form>
      <div className={styles.footer}>
        <p>Não esta cadastrado?</p>
        <Link to="/auth/signup">Cadastre-se</Link>
      </div>
    </>
  );
}

export default Login;
