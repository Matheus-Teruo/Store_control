import styles from "./Login.module.scss";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/utils/Button";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import Input from "@/components/utils/AuthInput";
import { useReducer, useState } from "react";
import useUserService from "@service/voluntary/useUserService";
import {
  isMessage,
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import User from "@data/volunteers/User";
import {
  initialUserState,
  loginPayload,
  userReducer,
} from "@reducer/voluntary/userReducer";
import {
  ArrowRightSVG,
  LockPadCloseSVG,
  LockPadOpenSVG,
  UserCheckSVG,
  UserSVG,
  UserXSVG,
} from "@/assets/svg";

function Login() {
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const [messageError, setMessageError] = useState<Record<string, string>>({});
  const [waitingFetch, setWaitingFetch] = useState<boolean>(false);
  const { addNotification } = useAlertsContext();
  const { login } = useUserContext();
  const { loginVoluntary } = useUserService();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitingFetch(true);
    const user = await loginVoluntary(loginPayload(state));
    if (user && !isMessage<User>(user)) {
      addNotification({
        title: "Login Success",
        message: `User ${state.username} logged`,
        type: MessageType.OK,
      });
      login(user);
      dispatch({ type: "RESET" });
      navigate("/workspace", { replace: true });
    } else if (user) {
      const message = user;
      if (message.invalidFields) setMessageError(message.invalidFields);
    }
    setWaitingFetch(false);
  };

  return (
    <>
      <h1 className={styles.title}>Entrar</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <Input
            value={state.username}
            onChange={(e) =>
              dispatch({ type: "SET_USERNAME", payload: e.target.value })
            }
            id="username"
            placeholder="Usuário"
            ComponentUntouched={UserSVG}
            ComponentAccepted={UserCheckSVG}
            ComponentRejected={UserXSVG}
            isRequired
            message={messageError["username"]}
          />
        </div>
        <div className={styles.field}>
          <Input
            value={state.password}
            onChange={(e) =>
              dispatch({ type: "SET_PASSWORD", payload: e.target.value })
            }
            id="password"
            placeholder="Senha"
            ComponentUntouched={LockPadOpenSVG}
            ComponentAccepted={LockPadCloseSVG}
            ComponentRejected={LockPadOpenSVG}
            isSecret
            isRequired
            message={messageError["password"]}
          />
        </div>
        <div className={styles.buttonSpace}>
          <Button type={ButtonHTMLType.Submit} loading={waitingFetch}>
            <p>Entrar</p>
            <ArrowRightSVG />
          </Button>
        </div>
      </form>
      <div className={styles.footer}>
        <p>Não esta cadastrado?</p>
        <Link to="/auth/signup">
          <span>Cadastre-se</span>
        </Link>
      </div>
    </>
  );
}

export default Login;
