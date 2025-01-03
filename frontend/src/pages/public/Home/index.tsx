import styles from "./Home.module.scss";
import Logo from "@/assets/image/LogoStoreControl.png";
import { Link } from "react-router-dom";
import {
  useAlertsContext,
  MessageType,
} from "@/context/AlertsContext/useUserContext";
import Button from "@/components/utils/Button";

function Home() {
  const { addNotification } = useAlertsContext();

  return (
    <div className={styles.background}>
      <div className={styles.body}>
        <div className={styles.section}>
          <img
            src={Logo}
            alt="Logo: imagem circular com um rosto de raposa no meio"
          />
          <h1 className={styles.title}>Store Control</h1>
        </div>
        <div className={styles.section}>
          <Link className={`${styles.link} ${styles.linkMenu}`} to="/menu">
            <span>Cardápio</span>
          </Link>
          <div className={styles.authSection}>
            <Link className={styles.link} to="/auth/login">
              <span>Entrar</span>
            </Link>
            <p>ou</p>
            <Link className={styles.link} to="/auth/signup">
              <span>Cadastrar</span>
            </Link>

            <Button
              onClick={() =>
                addNotification({
                  title: "OK",
                  message: "test ok",
                  type: MessageType.OK,
                })
              }
            >
              add notification ok
            </Button>
            <Button
              onClick={() =>
                addNotification({
                  title: "Warning",
                  message: "test warning",
                  type: MessageType.WARNING,
                })
              }
            >
              add notification warning
            </Button>
            <Button
              onClick={() =>
                addNotification({
                  title: "Error",
                  message: "test error",
                  type: MessageType.ERROR,
                })
              }
            >
              add notification error
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
