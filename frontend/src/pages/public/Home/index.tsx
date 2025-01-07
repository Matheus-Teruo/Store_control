import styles from "./Home.module.scss";
import Logo from "@/assets/image/LogoStoreControl.png";
import Button from "@/components/utils/Button";
import { useUserContext } from "@context/UserContext/useUserContext";
import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const { user } = useUserContext();

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
          {/* MOCKED */}
          <Link
            className={`${styles.link} ${styles.linkMenu}`}
            to="/order/ordercard000002"
          >
            <span>MOCKED order</span>
          </Link>
          {/*  */}
          <Button onClick={() => setShowScanner(true)}>
            <span>Scanner</span>
          </Button>
          {user ? (
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
        </div>
        {showScanner && <div>scanner</div>}
      </div>
    </div>
  );
}

export default Home;
