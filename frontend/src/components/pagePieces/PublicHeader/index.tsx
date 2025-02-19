import styles from "./PublicHeader.module.scss";
import activeConfig from "@/config/activeConfig";
import { Link, Outlet } from "react-router-dom";

function PublicHeader() {
  return (
    <div>
      <ul className={styles.header}>
        {activeConfig.version === "simple" ? (
          <li>
            <h2 className={styles.title}>Cardápio</h2>
          </li>
        ) : (
          <>
            <li>
              <Link to="/menu">
                <h2 className={styles.title}>Cardápio</h2>
              </Link>
            </li>
            <li>
              <Link to="/order">
                <h2 className={styles.title}>Cartão</h2>
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
