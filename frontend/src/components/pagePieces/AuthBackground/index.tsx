import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./AuthBackground.module.scss";
import { Outlet } from "react-router-dom";
import Logo from "@/assets/image/LogoStoreControl.png";

function AuthBackground() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.background}>
      <div className={styles.header}>
        {location.pathname === "/auth/user" ? (
          <div onClick={() => navigate(-1)} className={styles.linkLogo}>
            <img
              src={Logo}
              alt="Logo: imagem circular com um rosto de raposa no meio"
            />
          </div>
        ) : (
          <Link to="/" className={styles.linkLogo}>
            <img
              src={Logo}
              alt="Logo: imagem circular com um rosto de raposa no meio"
            />
          </Link>
        )}
      </div>
      <div className={styles.body}>
        <Outlet />
      </div>
      <div className={styles.spaceHolder} />
    </div>
  );
}

export default AuthBackground;
