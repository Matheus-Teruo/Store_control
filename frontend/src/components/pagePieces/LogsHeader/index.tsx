import styles from "./LogsHeader.module.scss";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Logo from "@/assets/image/LogoStoreControl.png";
import activeConfig from "@/config/activeConfig";

function LogHeader() {
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
                  <Link to="/logs/trades">
                    <h3
                      className={`${location.pathname === "/logs/trades" && styles.selected}`}
                    >
                      Vendas Diretas
                    </h3>
                  </Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/logs/recharges">
                      <h3
                        className={`${location.pathname === "/logs/recharges" && styles.selected}`}
                      >
                        Recargas
                      </h3>
                    </Link>
                  </li>
                  <li>
                    <Link to="/logs/purchases">
                      <h3
                        className={`${location.pathname === "/logs/purchases" && styles.selected}`}
                      >
                        Vendas Tokens
                      </h3>
                    </Link>
                  </li>
                </>
              )}
              {activeConfig.enableCard && (
                <li>
                  <Link to="/logs/transactions">
                    <h3
                      className={`${location.pathname === "/logs/transactions" && styles.selected}`}
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
