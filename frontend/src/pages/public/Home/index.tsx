import styles from "./Home.module.scss";
import Logo from "@/assets/image/LogoStoreControl.png";
import activeConfig from "@/config/activeConfig";
import { isUserLogged } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { Link } from "react-router-dom";

function Home() {
  const { user } = useUserContext();

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
            <Link className={`${styles.link} ${styles.linkMenu}`} to="/card">
              <span>Cartão</span>
            </Link>
          )}
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
      </div>
    </div>
  );
}

export default Home;
