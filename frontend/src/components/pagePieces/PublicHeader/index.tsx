import styles from "./PublicHeader.module.scss";
import activeConfig from "@/config/activeConfig";
import { Link, Outlet, useLocation } from "react-router-dom";
import Logo from "@/assets/image/LogoStoreControl.png";

function PublicHeader() {
  const location = useLocation();
  return (
    <div>
      <div className={styles.headerBackground}>
        <div className={styles.header}>
          <Link to="/" className={styles.linkLogo}>
            <img
              src={Logo}
              alt="Logo: imagem circular com um rosto de raposa no meio"
            />
          </Link>
          <ul className={styles.navigate}>
            <Link to="/menu">
              <h2
                className={`${styles.title} ${location.pathname === "/menu" && styles.selected}`}
              >
                Cardápio
              </h2>
            </Link>
            {activeConfig.enableCard &&
              (location.pathname.startsWith("/card") ? (
                <li>
                  <h2 className={`${styles.title} ${styles.selected}`}>
                    Cartão
                  </h2>
                </li>
              ) : (
                <Link to="/card">
                  <h2 className={styles.title}>Cartão</h2>
                </Link>
              ))}
          </ul>
          <div className={styles.spaceHolder} />
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default PublicHeader;
