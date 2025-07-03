import styles from "./LogsHeader.module.scss";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Logo from "@/assets/image/LogoStoreControl.png";
import activeConfig from "@/config/activeConfig";

function LogHeader() {
  const location = useLocation();

  return (
    <div>
      <div className={styles.background}>
        <div className={styles.header}>
          <div className={styles.base}>
            <Link to="/workspace" className={styles.linkLogo}>
              <img
                src={Logo}
                alt="Logo: imagem circular com um rosto de raposa no meio"
              />
            </Link>
          </div>
          <div className={styles.baseNavigate}>
            <ul className={styles.navigate}>
              {!activeConfig.enableToken ? (
                <li>
                  <Link to="/analytics/logs/trades">
                    <h3
                      className={`${location.pathname === "/analytics/logs/trades" && styles.selected}`}
                    >
                      Vendas Diretas
                    </h3>
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/analytics/logs/recharges">
                      <h3
                        className={`${location.pathname === "/analytics/logs/recharges" && styles.selected}`}
                      >
                        Recargas
                      </h3>
                    </Link>
                  </li>
                  <li>
                    <Link to="/analytics/logs/purchases">
                      <h3
                        className={`${location.pathname === "/analytics/logs/purchases" && styles.selected}`}
                      >
                        Vendas por Tokens
                      </h3>
                    </Link>
                  </li>
                </>
              )}
              {activeConfig.enableCard && (
                <li>
                  <Link to="/analytics/logs/transactions">
                    <h3
                      className={`${location.pathname === "/analytics/logs/transactions" && styles.selected}`}
                    >
                      Transações de Caixa
                    </h3>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default LogHeader;
