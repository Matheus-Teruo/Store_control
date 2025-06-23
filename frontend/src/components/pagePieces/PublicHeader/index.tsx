import styles from "./PublicHeader.module.scss";
import activeConfig from "@/config/activeConfig";
import { Link, Outlet, useLocation } from "react-router-dom";
import LogoShizuoka from "@/assets/image/shizuoka_logo.png";

function PublicHeader() {
  const location = useLocation();
  return (
    <div>
      <div className={styles.headerBackground}>
        <div className={styles.header}>
          <Link to="/" className={styles.linkLogo}>
            <img
              src={LogoShizuoka}
              alt="Logo: símbolo de shizuoka, link para home"
            />
          </Link>
          <ul className={styles.navigate}>
            {location.pathname === "/menu" && (
              <li>
                <h2 className={styles.title}>Cardápio</h2>
              </li>
            )}
            {activeConfig.enableCard && location.pathname === "/card" && (
              <li>
                <h2 className={styles.title}>Cartão</h2>
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
