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
            {activeConfig.enableCard ? (
              <>
                <li>
                  <Link to="/menu">
                    <h2
                      className={`${styles.title} ${location.pathname === "/menu" && styles.selected}`}
                    >
                      Cardápio
                    </h2>
                  </Link>
                </li>
                <li>
                  <Link to="/card">
                    <h2
                      className={`${styles.title} ${location.pathname === "/card" && styles.selected}`}
                    >
                      Cartão
                    </h2>
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <h2 className={styles.title}>Cardápio</h2>
              </li>
            )}
          </ul>
          <div className={styles.spaceHolder} />
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default PublicHeader;
