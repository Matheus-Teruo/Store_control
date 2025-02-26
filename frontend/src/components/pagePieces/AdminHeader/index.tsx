import styles from "./AdminHeader.module.scss";
import { isAdmin } from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { Link, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Logo from "@/assets/image/LogoStoreControl.png";
import activeConfig from "@/config/activeConfig";

function AdminHeader() {
  const { user } = useUserContext();
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
              <li>
                <Link to="/admin/volunteers">
                  <h3
                    className={`${location.pathname === "/admin/volunteers" && styles.selected}`}
                  >
                    Voluntários
                  </h3>
                </Link>
              </li>
              {isAdmin(user) && (
                <>
                  <li>
                    <Link to="/admin/associations">
                      <h3
                        className={`${location.pathname === "/admin/associations" && styles.selected}`}
                      >
                        Associações
                      </h3>
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/stands">
                      <h3
                        className={`${location.pathname === "/admin/stands" && styles.selected}`}
                      >
                        Estandes
                      </h3>
                    </Link>
                  </li>
                  {activeConfig.enableCard && (
                    <li>
                      <Link to="/admin/cards">
                        <h3
                          className={`${location.pathname === "/admin/cards" && styles.selected}`}
                        >
                          Cartões
                        </h3>
                      </Link>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default AdminHeader;
