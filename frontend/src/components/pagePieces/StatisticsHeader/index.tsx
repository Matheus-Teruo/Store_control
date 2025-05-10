import styles from "./StatisticsHeader.module.scss";
import {
  isAdmin,
  isRegister,
  isSeller,
  isUserLogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { Link, Outlet, useLocation } from "react-router-dom";
import Logo from "@/assets/image/LogoStoreControl.png";
import activeConfig from "@/config/activeConfig";

function StatisticsHeader() {
  const { user } = useUserContext();
  const location = useLocation();

  const shouldShowRechargeLink =
    (!activeConfig.enableCard && isAdmin(user)) ||
    (isUserLogged(user) &&
      isRegister(user.summaryFunction, user.voluntaryRole));

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
              {shouldShowRechargeLink && (
                <li>
                  <Link to="/analytics/statistics/recharge">
                    <h3
                      className={`${location.pathname === "/analytics/statistics/recharge" && styles.selected}`}
                    >
                      Caixa
                    </h3>
                  </Link>
                </li>
              )}
              {isUserLogged(user) &&
                isSeller(user.summaryFunction, user.voluntaryRole) && (
                  <>
                    <li>
                      <Link to="/analytics/statistics/purchase">
                        <h3
                          className={`${location.pathname === "/analytics/statistics/purchase" && styles.selected}`}
                        >
                          Venda
                        </h3>
                      </Link>
                    </li>
                    <li>
                      <Link to="/analytics/statistics/product">
                        <h3
                          className={`${location.pathname === "/analytics/statistics/product" && styles.selected}`}
                        >
                          Produtos
                        </h3>
                      </Link>
                    </li>
                  </>
                )}
              {activeConfig.enableCard && isAdmin(user) && (
                <li>
                  <Link to="/analytics/statistics/customer">
                    <h3
                      className={`${location.pathname === "/analytics/statistics/customer" && styles.selected}`}
                    >
                      Consumidor
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

export default StatisticsHeader;
