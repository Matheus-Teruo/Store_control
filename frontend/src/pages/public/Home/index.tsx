import styles from "./Home.module.scss";
import Logo from "@/assets/image/LogoStoreControl.png";
import { Link } from "react-router-dom";

function Home() {
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
