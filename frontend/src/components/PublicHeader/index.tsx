import styles from "./PublicHeader.module.scss";
import activeConfig from "@/config/activeConfig";
import { Link, Outlet } from "react-router-dom";

function PublicHeader() {
  return (
    <div>
      <ul className={styles.header}>
        {activeConfig.version === "simple" ? (
          <li>
            <div className={styles.title}>Cardápio</div>
          </li>
        ) : (
          <>
            <li>
              <Link to="/menu" className={styles.title}>
                Cardápio
              </Link>
            </li>
            <li>
              <Link to="/order" className={styles.title}>
                Cartão
              </Link>
            </li>
          </>
        )}
      </ul>
      <Outlet />
    </div>
  );
}

export default PublicHeader;
