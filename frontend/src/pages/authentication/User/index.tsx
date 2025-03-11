import styles from "./User.module.scss";
import { ReactElement, useEffect, useReducer, useState } from "react";
import Button from "@/components/utils/Button";
import Input from "@/components/utils/AuthInput";
import useVoluntaryService from "@service/voluntary/useVoluntaryService";
import Voluntary, { VoluntaryRole } from "@/data/volunteers/Voluntary";
import { useUserContext } from "@context/UserContext/useUserContext";
import { useNavigate } from "react-router-dom";
import {
  isMessage,
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { isUserLogged, isUserUnlogged } from "@/utils/checkAuthentication";
import { initialUserState, userReducer } from "@reducer/voluntary/userReducer";
import {
  AwardSVG,
  BadgeSVG,
  CheckSVG,
  CircleSVG,
  FaceFrownSVG,
  FaceMehSVG,
  FaceSmileSVG,
  LockPadCloseSVG,
  LockPadOpenSVG,
  ToolSVG,
  UserCheckSVG,
  UserSVG,
  UserXSVG,
  XSVG,
} from "@/assets/svg";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";

const voluntaryInitialValue: Voluntary = {
  uuid: "",
  username: "username",
  fullname: "fullname",
  summaryFunction: undefined,
  voluntaryRole: VoluntaryRole.VOLUNTARY,
};

const VoluntaryRoleMetadata: Record<
  VoluntaryRole,
  { label: string; icon: ReactElement }
> = {
  [VoluntaryRole.VOLUNTARY]: {
    label: "Voluntario",
    icon: <CircleSVG />,
  },
  [VoluntaryRole.MANAGEMENT]: {
    label: "Gerente",
    icon: <AwardSVG />,
  },
  [VoluntaryRole.ADMIN]: {
    label: "Administrador",
    icon: <ToolSVG />,
  },
};

function User() {
  const [userProperties, setUserProperties] = useState<Voluntary>(
    voluntaryInitialValue,
  );
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const [update, setUpdate] = useState<
    "username" | "fullname" | "password" | ""
  >("");
  const [messageError, setMessageError] = useState<Record<string, string>>({});
  const [waitingFetch, setWaitingFetch] = useState<
    "username" | "fullname" | "password" | ""
  >("");
  const [touched, setTouched] = useState<boolean>(false);
  const { addNotification } = useAlertsContext();
  const { user, logout } = useUserContext();
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
    setWaitingFetch(update);
    setTouched(false);
    const voluntary = await updateVoluntary({
      uuid: userProperties.uuid,
      username: update === "username" ? state.username : undefined,
      password: update === "password" ? state.password : undefined,
      fullname: update === "fullname" ? state.fullname : undefined,
    });
    if (voluntary && !isMessage<Voluntary>(voluntary)) {
      addNotification({
        title: "Update Success",
        message: `Update ${update}: ${update === "username" ? state.username : update === "password" ? "successful" : update === "fullname" ? state.fullname : ""}`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
      setUpdate("");
      setUserProperties(voluntary);
    } else if (voluntary) {
      const message = voluntary;
      if (message.invalidFields) setMessageError(message.invalidFields);
    }
    setTouched(true);
    setWaitingFetch("");
  };

  const handleUpdate = (value: "username" | "fullname" | "password" | "") => {
    setTouched(false);
    setUpdate(value);
  };

  const handleLogout = async () => {
    logout();
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <p className={styles.title}>Usuário</p>
        {update !== "username" ? (
          <div
            className={styles.value}
            onClick={() => handleUpdate("username")}
          >
            <UserSVG />
            <p>{userProperties.username}</p>
          </div>
        ) : (
          <div className={styles.update}>
            <Input
              value={state.username}
              onChange={(e) =>
                dispatch({ type: "SET_USERNAME", payload: e.target.value })
              }
              ComponentUntouched={UserSVG}
              ComponentAccepted={UserCheckSVG}
              ComponentRejected={UserXSVG}
              id="username"
              placeholder="Alterar Usuário"
              isRequired
              showStatus={touched}
              message={messageError["username"]}
            />
            <Button
              className={styles.buttonCancel}
              onClick={() => handleUpdate("")}
            >
              <XSVG />
            </Button>
            <Button
              type={ButtonHTMLType.Submit}
              loading={waitingFetch === "username"}
            >
              <CheckSVG />
            </Button>
          </div>
        )}
      </div>
      <div className={styles.field}>
        <p className={styles.title}>Nome Completo</p>
        {update !== "fullname" ? (
          <div
            className={styles.value}
            onClick={() => handleUpdate("fullname")}
          >
            <FaceSmileSVG />
            <p>{userProperties.fullname}</p>
          </div>
        ) : (
          <div className={styles.update}>
            <Input
              value={state.fullname}
              onChange={(e) =>
                dispatch({ type: "SET_FULLNAME", payload: e.target.value })
              }
              ComponentUntouched={FaceMehSVG}
              ComponentAccepted={FaceSmileSVG}
              ComponentRejected={FaceFrownSVG}
              id="fullname"
              placeholder="Alterar Nome Completo"
              isRequired
              showStatus={touched}
              message={messageError["fullname"]}
            />
            <Button
              className={styles.buttonCancel}
              onClick={() => handleUpdate("")}
            >
              <XSVG />
            </Button>
            <Button
              type={ButtonHTMLType.Submit}
              loading={waitingFetch === "fullname"}
            >
              <CheckSVG />
            </Button>
          </div>
        )}
      </div>
      <div className={styles.field}>
        <p className={styles.title}>Função</p>
        {userProperties.summaryFunction ? (
          <div className={styles.value}>
            <BadgeSVG />
            <p>{userProperties.summaryFunction.typeOfFunction}</p>
            <p>{userProperties.summaryFunction.functionName}</p>
          </div>
        ) : (
          <div className={styles.value}>
            <BadgeSVG />
            <p className={styles.functionNone}>Sem função</p>
          </div>
        )}
      </div>
      <div className={styles.field}>
        <p className={styles.title}>Permissão</p>
        <div className={styles.value}>
          {VoluntaryRoleMetadata[userProperties.voluntaryRole].icon}
          <p>{VoluntaryRoleMetadata[userProperties.voluntaryRole].label}</p>
        </div>
      </div>
      <div className={styles.field}>
        {update !== "password" ? (
          <div className={styles.footer}>
            <Button
              className={styles.buttonFooter}
              onClick={() => handleUpdate("password")}
            >
              Alterar Senha
            </Button>
            <Button className={styles.buttonFooter} onClick={handleLogout}>
              Sair
            </Button>
          </div>
        ) : (
          <>
            <p>Editar Senha</p>
            <div className={styles.valuePassword}>
              <Input
                value={state.password}
                onChange={(e) =>
                  dispatch({ type: "SET_PASSWORD", payload: e.target.value })
                }
                ComponentUntouched={LockPadOpenSVG}
                ComponentAccepted={LockPadCloseSVG}
                ComponentRejected={LockPadOpenSVG}
                id="password"
                placeholder="Nova Senha"
                isSecret
                isRequired
                showStatus={touched}
                message={messageError["password"]}
              />
            </div>
            <div className={styles.valuePassword}>
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
                placeholder="Confirmar Nova Senha"
                isSecret
                isRequired
                onlyStatus
                showStatus={touched}
                message={messageError["password"]}
              />
            </div>
            <div className={styles.updateFooter}>
              <Button
                className={styles.buttonCancel}
                onClick={() => handleUpdate("")}
              >
                <XSVG />
              </Button>
              <Button
                type={ButtonHTMLType.Submit}
                loading={waitingFetch === "password"}
              >
                <CheckSVG />
              </Button>
            </div>
            <Button className={styles.buttonFooter} onClick={handleLogout}>
              Sair
            </Button>
          </>
        )}
      </div>
    </form>
  );
}

export default User;
