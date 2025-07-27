import styles from "./Hub.module.scss";
import {
  isAdmin,
  isRegister,
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

  const shouldShowRechargeLink =
    (!activeConfig.enableCard && isAdmin(user)) ||
    (isUserLogged(user) &&
      isRegister(user.summaryFunction, user.voluntaryRole));

  return (
    <div className={styles.background}>
      <Link to="/" className={styles.linkLogo}>
        <img
          src={Logo}
          alt="Logo: imagem circular com um rosto de raposa no meio"
        />
      </Link>
      {isUserLogged(user) &&
        (isSeller(user.summaryFunction, user.voluntaryRole) ||
          isRegister(user.summaryFunction, user.voluntaryRole)) && (
          <h2>Função</h2>
        )}
      <ul className={styles.home}>
        {isUserLogged(user) && (
          <>
            {isSeller(user.summaryFunction, user.voluntaryRole) &&
              activeConfig.enableOrder && (
                <li className={styles.liSales}>
                  <Link className={styles.links} to="/workspace/sales">
                    Atendentes
                  </Link>
                </li>
              )}
            {isSeller(user.summaryFunction, user.voluntaryRole) &&
              !activeConfig.enableOrder && (
                <li className={styles.liSales}>
                  <Link className={styles.links} to="/workspace/sales">
                    Vendas
                  </Link>
                </li>
              )}
            {activeConfig.enableCard &&
              isRegister(user.summaryFunction, user.voluntaryRole) && (
                <li className={styles.liCashier}>
                  <Link className={styles.links} to="/workspace/registers">
                    Caixa
                  </Link>
                </li>
              )}
            {isSeller(user.summaryFunction, user.voluntaryRole) && (
              <li className={styles.liProducts}>
                <Link className={styles.links} to="/workspace/products">
                  Produtos
                </Link>
              </li>
            )}
            {!isSeller(user.summaryFunction, user.voluntaryRole) &&
              !isRegister(user.summaryFunction, user.voluntaryRole) && (
                <li className={styles.liDefault}>
                  <h3>Bem vindo</h3>
                  <p>
                    Você não está alocado no momento. Comunique-se com o
                    coordenador da sua associação para conseguir permissão.
                  </p>
                </li>
              )}
          </>
        )}
      </ul>
      {isUserLogged(user) && user.voluntaryRole === VoluntaryRole.MANAGEMENT ? (
        <h2>Gerente</h2>
      ) : (
        isUserLogged(user) &&
        user.voluntaryRole === VoluntaryRole.ADMIN && <h2>Administrador</h2>
      )}
      {isManeger(user) && (
        <ul className={styles.manager}>
          <h3>Histórico (Logs)</h3>
          {!activeConfig.enableToken ? (
            <li className={styles.liLogPurchases}>
              <Link className={styles.links} to="/analytics/logs/trades">
                Vendas Diretas
              </Link>
            </li>
          ) : (
            <li className={styles.liLogPurchases}>
              <Link className={styles.links} to="/analytics/logs/sales">
                Vendas
              </Link>
            </li>
          )}
          {activeConfig.enableCard && (
            <li className={styles.liLogTransactions}>
              <Link className={styles.links} to="/analytics/logs/transactions">
                Transações de Caixa
              </Link>
            </li>
          )}
          <h3>Estatísticas</h3>
          {shouldShowRechargeLink && (
            <li
              className={
                isAdmin(user)
                  ? styles.liStatisticsRegister
                  : styles.liStatistics
              }
            >
              <Link
                className={styles.links}
                to="/analytics/statistics/recharge"
              >
                Financeiro
              </Link>
            </li>
          )}
          {isUserLogged(user) &&
            isSeller(user.summaryFunction, user.voluntaryRole) && (
              <>
                <li
                  className={
                    isAdmin(user)
                      ? styles.liStatisticsSeller
                      : styles.liStatistics
                  }
                >
                  <Link
                    className={styles.links}
                    to="/analytics/statistics/purchase"
                  >
                    Venda
                  </Link>
                </li>
                <li className={styles.liStatistics}>
                  <Link
                    className={styles.links}
                    to="/analytics/statistics/product"
                  >
                    Total de Produtos
                  </Link>
                </li>
              </>
            )}
          {activeConfig.enableCard && isAdmin(user) && (
            <li className={styles.liStatistics}>
              <Link
                className={styles.links}
                to="/analytics/statistics/customer"
              >
                Consumidor
              </Link>
            </li>
          )}
          <h3>Organização</h3>
          {isAdmin(user) && (
            <li className={styles.liTags}>
              <Link className={styles.links} to="/admin/tags">
                Tags
              </Link>
            </li>
          )}
          <li className={styles.liVolunteers}>
            <Link className={styles.links} to="/admin/volunteers">
              Voluntários
            </Link>
          </li>
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
              <li className={styles.liRegisters}>
                <Link className={styles.links} to="/admin/registers">
                  Caixas
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
      )}
    </div>
  );
}

export default Hub;
