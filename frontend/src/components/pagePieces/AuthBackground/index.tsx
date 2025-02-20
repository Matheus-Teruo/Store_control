import { Link } from "react-router-dom";
import styles from "./AuthBackground.module.scss";
import { Outlet } from "react-router-dom";
import Logo from "@/assets/image/LogoStoreControl.png";

function AuthBackground() {
  return (
    <div className={styles.background}>
      <div className={styles.header}>
        <Link to="/" className={styles.linkLogo}>
          <img
            src={Logo}
            alt="Logo: imagem circular com um rosto de raposa no meio"
          />
        </Link>
      </div>
      <div className={styles.body}>
        <Outlet />
      </div>
      <div className={styles.spaceHolder} />
    </div>
  );
}

export default AuthBackground;
