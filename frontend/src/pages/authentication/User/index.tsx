import styles from "./User.module.scss";
import { useEffect, useReducer, useState } from "react";
import Button from "@/components/utils/Button";
import Input from "@/components/utils/AuthInput";
import useVoluntaryService from "@service/voluntary/useVoluntaryService";
import Voluntary, { VoluntaryRole } from "@/data/volunteers/Voluntary";
import { useUserContext } from "@context/UserContext/useUserContext";
import { useNavigate } from "react-router-dom";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { isUserLogged, isUserUnlogged } from "@/utils/checkAuthentication";
import { initialUserState, userReducer } from "@reducer/voluntary/userReducer";
import {
  AwardSVG,
  BadgeSVG,
  CheckSVG,
  FaceFrownSVG,
  FaceMehSVG,
  FaceSmileSVG,
  LockPadCloseSVG,
  LockPadOpenSVG,
  UserCheckSVG,
  UserSVG,
  UserXSVG,
  XSVG,
} from "@/assets/svg";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import useUserService from "@service/voluntary/useUserService";

const voluntaryInitialValue: Voluntary = {
  uuid: "",
  username: "username",
  fullname: "fullname",
  summaryFunction: undefined,
  voluntaryRole: VoluntaryRole.VOLUNTARY,
};

const VoluntaryRoleMetadata: Record<VoluntaryRole, { label: string }> = {
  [VoluntaryRole.VOLUNTARY]: { label: "Voluntario" },
  [VoluntaryRole.MANAGEMENT]: { label: "Gerente" },
  [VoluntaryRole.ADMIN]: { label: "Administrador" },
};

function User() {
  const [userProperties, setUserProperties] = useState<Voluntary>(
    voluntaryInitialValue,
  );
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  const [update, setUpdate] = useState<
    "username" | "fullname" | "password" | ""
  >("");
  const { addNotification } = useAlertsContext();
  const { user, logout } = useUserContext();
  const { getVoluntary, updateVoluntary } = useVoluntaryService();
  const { logoutVoluntary } = useUserService();
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
    const voluntary = await updateVoluntary({
      uuid: userProperties.uuid,
      username: update === "username" ? state.username : undefined,
      password: update === "password" ? state.password : undefined,
      fullname: update === "fullname" ? state.fullname : undefined,
    });
    if (voluntary) {
      addNotification({
        title: "Update Success",
        message: `Update ${update}: ${update === "username" ? state.username : update === "password" ? "successful" : update === "fullname" ? state.fullname : ""}`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
      setUpdate("");
      setUserProperties(voluntary);
    }
  };

  const handleLogout = async () => {
    await logoutVoluntary();
    logout();
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <p className={styles.title}>Usuário</p>
        {update !== "username" ? (
          <div className={styles.value} onClick={() => setUpdate("username")}>
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
            />
            <Button
              className={styles.buttonCancel}
              onClick={() => setUpdate("")}
            >
              <XSVG />
            </Button>
            <Button type={ButtonHTMLType.Submit}>
              <CheckSVG />
            </Button>
          </div>
        )}
      </div>
      <div className={styles.field}>
        <p className={styles.title}>Nome Completo</p>
        {update !== "fullname" ? (
          <div className={styles.value} onClick={() => setUpdate("fullname")}>
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
            />
            <Button
              className={styles.buttonCancel}
              onClick={() => setUpdate("")}
            >
              <XSVG />
            </Button>
            <Button type={ButtonHTMLType.Submit}>
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
          <AwardSVG />
          <p>{VoluntaryRoleMetadata[userProperties.voluntaryRole].label}</p>
        </div>
      </div>
      <div className={styles.field}>
        {update !== "password" ? (
          <div className={styles.footer}>
            <Button
              className={styles.buttonFooter}
              onClick={() => setUpdate("password")}
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
              />
            </div>
            <div className={styles.updateFooter}>
              <Button
                className={styles.buttonCancel}
                onClick={() => setUpdate("")}
              >
                <XSVG />
              </Button>
              <Button type={ButtonHTMLType.Submit}>
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
