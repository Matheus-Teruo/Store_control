import styles from "./Signup.module.scss";
import Button from "@/components/utils/Button";
import Input from "@/components/utils/AuthInput";
import { useReducer, useState } from "react";
import useUserService from "@service/voluntary/useUserService";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import {
  isMessage,
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@context/UserContext/useUserContext";
import {
  initialUserState,
  signupPayload,
  userReducer,
} from "@reducer/voluntary/userReducer";
import {
  CheckSVG,
  FaceFrownSVG,
  FaceMehSVG,
  FaceSmileSVG,
  LockPadCloseSVG,
  LockPadOpenSVG,
  UserCheckSVG,
  UserSVG,
  UserXSVG,
} from "@/assets/svg";

function Signup() {
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const [messageError, setMessageError] = useState<Record<string, string>>({});
  const { addNotification } = useAlertsContext();
  const { login } = useUserContext();
  const { signupVoluntary } = useUserService();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.password == state.confirmPassword) {
      const voluntary = await signupVoluntary(signupPayload(state));
      if (voluntary && !isMessage(voluntary)) {
        addNotification({
          title: "Signup Success",
          message: `Create user ${voluntary.username} and logged`,
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
      } else if (isMessage(voluntary)) {
        const message = voluntary;
        if (message.invalidFields) setMessageError(message.invalidFields);
      }
    } else {
      addNotification({
        title: "Error to Submit",
        message: `password and password confirmation are not iqual`,
        type: MessageType.WARNING,
      });
    }
  };

  return (
    <>
      <h1 className={styles.title}>Cadastrar</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <Input
            value={state.username}
            onChange={(e) =>
              dispatch({ type: "SET_USERNAME", payload: e.target.value })
            }
            ComponentUntouched={UserSVG}
            ComponentAccepted={UserCheckSVG}
            ComponentRejected={UserXSVG}
            id="username"
            placeholder="Usuário"
            isRequired
            message={messageError["username"]}
          />
        </div>
        <div className={styles.field}>
          <Input
            value={state.fullname}
            onChange={(e) =>
              dispatch({ type: "SET_FULLNAME", payload: e.target.value })
            }
            ComponentUntouched={FaceMehSVG}
            ComponentAccepted={FaceSmileSVG}
            ComponentRejected={FaceFrownSVG}
            id="fullname"
            placeholder="Nome Completo"
            isRequired
            message={messageError["fullname"]}
          />
        </div>
        <div className={styles.field}>
          <Input
            value={state.password}
            onChange={(e) =>
              dispatch({ type: "SET_PASSWORD", payload: e.target.value })
            }
            ComponentUntouched={LockPadOpenSVG}
            ComponentAccepted={LockPadCloseSVG}
            ComponentRejected={LockPadOpenSVG}
            id="password"
            placeholder="Senha"
            isSecret
            isRequired
            message={messageError["password"]}
          />
        </div>
        <div className={styles.field}>
          <Input
            value={state.confirmPassword}
            onChange={(e) =>
              dispatch({
                type: "SET_CONFIRM_PASSWORD",
                payload: e.target.value,
              })
            }
            ComponentUntouched={LockPadOpenSVG}
            ComponentAccepted={LockPadCloseSVG}
            ComponentRejected={LockPadOpenSVG}
            id="confirmPassword"
            placeholder="Confirmar Senha"
            isSecret
            isRequired
          />
        </div>
        <div className={styles.button}>
          <Button type={ButtonHTMLType.Submit}>
            <p>Cadastrar</p>
            <CheckSVG />
          </Button>
        </div>
      </form>
    </>
  );
}

export default Signup;
