import styles from "./Home.module.scss";
import Logo from "@/assets/image/LogoStoreControl.png";
import QRcodeReader from "@/components/QRcodeReader";
import activeConfig from "@/config/activeConfig";
import { isUserLogged } from "@/utils/checkAuthentication";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [QRcode, setQRcode] = useState<string | null>(null);
  const { addNotification } = useAlertsContext();
  const { user } = useUserContext();

  const handleQRcode = (value: string) => {
    const cardId = value.split("/").at(-1);
    if (cardId && cardId.length === 15) {
      setQRcode(cardId);
    } else {
      console.log(cardId);
      addNotification({
        title: "Erro no código do QRcode",
        message: "QRcode não é de um cartão",
        type: MessageType.WARNING,
      });
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.body}>
        <div className={styles.section}>
          <h1 className={styles.title}>Store Control</h1>
          <img
            src={Logo}
            alt="Logo: imagem circular com um rosto de raposa no meio"
          />
        </div>
        <div className={styles.section}>
          <Link className={`${styles.link} ${styles.linkMenu}`} to="/menu">
            <span>Cardápio</span>
          </Link>
          {activeConfig.enableCard && (
            <button
              type="button"
              className={`${styles.link} ${styles.linkMenu}`}
              onClick={() => setShowScanner(true)}
            >
              <span>Scanner</span>
            </button>
          )}
          {QRcode && <div>{QRcode}</div>}
          {isUserLogged(user) ? (
            <>
              <Link
                className={`${styles.link} ${styles.linkMenu}`}
                to="/workspace"
              >
                <span>Funções</span>
              </Link>
              <Link
                className={`${styles.link} ${styles.linkMenu}`}
                to="/auth/user"
              >
                <span>Perfil</span>
              </Link>
            </>
          ) : (
            <div className={styles.authSection}>
              <Link className={styles.link} to="/auth/login">
                <span>Entrar</span>
              </Link>
              <p>ou</p>
              <Link className={styles.link} to="/auth/signup">
                <span>Cadastrar</span>
              </Link>
            </div>
          )}
          {/* <div>
            <LanguageSelect />
          </div> */}
        </div>
        {showScanner && (
          <QRcodeReader
            onChange={handleQRcode}
            setClose={() => setShowScanner(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
