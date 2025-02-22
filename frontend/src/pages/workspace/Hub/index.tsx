import styles from "./Hub.module.scss";
import {
  isAdmin,
  isCashier,
  isManeger,
  isSeller,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import Logo from "@/assets/image/LogoStoreControl.png";
import { useUserContext } from "@context/UserContext/useUserContext";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { VoluntaryRole } from "@data/volunteers/Voluntary";
import activeConfig from "@/config/activeConfig";

function Hub() {
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserUnlogged(user)) {
      navigate("/");
    }
  }, [navigate, user]);

  return (
    <div className={styles.background}>
      <Link to="/" className={styles.linkLogo}>
        <img
          src={Logo}
          alt="Logo: imagem circular com um rosto de raposa no meio"
        />
      </Link>
      <h2>Função</h2>
      <ul className={styles.home}>
        {isUserLogged(user) &&
          isSeller(user.summaryFunction, user.voluntaryRole) && (
            <li className={styles.liSales}>
              <Link className={styles.links} to="/workspace/sales">
                Vendas
              </Link>
            </li>
          )}
        {activeConfig.enableCard &&
          isUserLogged(user) &&
          isCashier(user.summaryFunction, user.voluntaryRole) && (
            <li className={styles.liCashier}>
              <Link className={styles.links} to="/workspace/cashier">
                Caixa
              </Link>
            </li>
          )}
        <li className={styles.liProducts}>
          <Link className={styles.links} to="/workspace/products">
            Produtos
          </Link>
        </li>
      </ul>
      {isUserLogged(user) && user.voluntaryRole === VoluntaryRole.MANAGEMENT ? (
        <h2>Gerente</h2>
      ) : (
        <h2>Administrador</h2>
      )}
      <ul className={styles.manager}>
        {isManeger(user) && (
          <li className={styles.liVolunteers}>
            <Link className={styles.links} to="/admin/volunteers">
              Voluntários
            </Link>
          </li>
        )}
        {isAdmin(user) && (
          <>
            <li className={styles.liAssociations}>
              <Link className={styles.links} to="/admin/associations">
                Associações
              </Link>
            </li>
            <li className={styles.liStands}>
              <Link className={styles.links} to="/admin/stands">
                Estandes
              </Link>
            </li>
            {activeConfig.enableCard && (
              <li className={styles.liCards}>
                <Link className={styles.links} to="/admin/cards">
                  Cartões
                </Link>
              </li>
            )}
          </>
        )}
      </ul>
    </div>
  );
}

export default Hub;
