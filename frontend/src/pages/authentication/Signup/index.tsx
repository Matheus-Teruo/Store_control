import styles from "./Signup.module.scss";
import Button from "@/components/utils/Button";
import Input from "@/components/utils/Input";
import { useReducer } from "react";
import { signupVoluntary } from "@service/voluntary/userService";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import {
  MessageType,
  useAlertsContext,
} from "@/context/AlertsContext/useUserContext";
import { useHandleApiError } from "@/axios/handlerApiError";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@context/UserContext/useUserContext";
import {
  checkSignupUser,
  initialUserState,
  userReducer,
} from "@reducer/voluntary/userReducer";

function Signup() {
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const { addNotification } = useAlertsContext();
  const { login } = useUserContext();
  const handleApiError = useHandleApiError();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, fullname, password } = state;

    if (checkSignupUser(state)) {
      switch (checkSignupUser(state)) {
        case "username":
          // TODO: interface input error
          break;
        case "fullname":
          // TODO: interface input error
          break;
        case "password":
          // TODO: interface input error
          break;
        case "confirmPassword":
          // TODO: interface input error
          break;
      }
      return;
    }

    try {
      const voluntary = await signupVoluntary({
        username,
        fullname,
        password,
      });
      addNotification({
        title: "Signup Success",
        message: `Create user ${username} and logged`,
        type: MessageType.OK,
      });
      login({
        uuid: voluntary.uuid,
        firstName: voluntary.fullname.split(" ")[0],
        summaryFunction: voluntary.summaryFunction,
        voluntaryRole: voluntary.voluntaryRole,
      });
      dispatch({ type: "RESET" });
      navigate("/workspace", { replace: true });
    } catch (error) {
      handleApiError(error);
    }
  };

  return (
    <>
      <h1 className={styles.title}>Cadastrar</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          value={state.username}
          onChange={(e) =>
            dispatch({ type: "SET_USERNAME", payload: e.target.value })
          }
          id="username"
          placeholder="Usuário"
          isRequired
        />
        <Input
          value={state.fullname}
          onChange={(e) =>
            dispatch({ type: "SET_FULLNAME", payload: e.target.value })
          }
          id="fullname"
          placeholder="Nome Completo"
          isRequired
        />
        <Input
          value={state.password}
          onChange={(e) =>
            dispatch({ type: "SET_PASSWORD", payload: e.target.value })
          }
          id="password"
          placeholder="Senha"
          isSecret
          isRequired
        />
        <Input
          value={state.confirmPassword}
          onChange={(e) =>
            dispatch({ type: "SET_CONFIRM_PASSWORD", payload: e.target.value })
          }
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
