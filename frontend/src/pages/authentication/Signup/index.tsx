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
  KeySVG,
  LockPadCloseSVG,
  LockPadOpenSVG,
  UserCheckSVG,
  UserSVG,
  UserXSVG,
} from "@/assets/svg";

function Signup() {
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const [messageError, setMessageError] = useState<Record<string, string>>({});
  const [waitingFetch, setWaitingFetch] = useState<boolean>(false);
  const [touched, setTouched] = useState<boolean>(false);
  const { addNotification } = useAlertsContext();
  const { login } = useUserContext();
  const { signupVoluntary } = useUserService();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state.password == state.confirmPassword) {
      setWaitingFetch(true);
      setTouched(false);
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
    setTouched(true);
    setWaitingFetch(false);
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
            showStatus={touched}
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
            showStatus={touched}
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
            showStatus={touched}
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
            onlyStatus
            showStatus={touched}
            message={messageError["password"]}
          />
        </div>
        <div className={styles.field}>
          <Input
            value={state.associationKey}
            onChange={(e) =>
              dispatch({
                type: "SET_ASSOCIATION_KEY",
                payload: e.target.value,
              })
            }
            ComponentUntouched={KeySVG}
            ComponentAccepted={KeySVG}
            ComponentRejected={KeySVG}
            id="associationKey"
            placeholder="Chave da Associação"
            isRequired
            showStatus={touched}
            message={messageError["associationKey"]}
          />
        </div>
        <div className={styles.button}>
          <Button type={ButtonHTMLType.Submit} loading={waitingFetch}>
            <p>Cadastrar</p>
            <CheckSVG />
          </Button>
        </div>
      </form>
    </>
  );
}

export default Signup;
