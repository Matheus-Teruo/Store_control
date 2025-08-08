import styles from "./PurchaseLogs.module.scss";
import { useCallback, useEffect, useReducer, useState } from "react";
import { SummaryTrade } from "@data/operations/Trade";
import Button from "@/components/utils/Button";
import PageSelect from "@/components/selects/PageSelect";
import useTradeService from "@service/operations/useTradeService";
import PurchaseDetail from "./PurchaseDetail";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import { formReducer, initialFormState } from "@reducer/formReducer";
import {
  isAdmin,
  isManeger,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { useNavigate } from "react-router-dom";
import { PaymentStringMetadata } from "@/components/selects/PaymentSelect/paymentMetadata";

function PurchaseLogs() {
  const [trades, setTrades] = useState<SummaryTrade[]>([]);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const [modeAdmin, setModeAdmin] = useState<boolean>(false);
  const { getTrades } = useTradeService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const fetchTrades = useCallback(
    async (modeAmin: boolean) => {
      if (isManeger(user)) {
        const response = await getTrades(
          modeAmin ? undefined : user.summaryFunction?.uuid,
          page.number,
          undefined,
          "tradeTimestamp,asc",
        );
        if (response) {
          setTrades(response.content);
          pageDispatch({
            type: "SET_PAGE_MAX",
            payload: response.page.totalPages,
          });
        }
      }
    },
    [user, page.number, getTrades],
  );

  useEffect(() => {
    if (isUserLogged(user) && isManeger(user)) {
      if (isAdmin(user)) {
        setModeAdmin(true);
        fetchTrades(true);
      } else {
        fetchTrades(false);
      }
    } else if (isUserUnlogged(user)) {
      navigate("/");
    }
  }, [user, navigate, fetchTrades]);

  const handleFormShow = () => {
    formDispach({ type: "SET_FALSE" });
    fetchTrades(modeAdmin);
  };

  return (
    <div className={styles.body}>
      <li key={"header"} className={styles.listHeader}>
        <p className={styles.headerDate}>Data</p>
        <p className={styles.headerQuantity}>Itens</p>
        <p className={styles.headerPaymentType}>Pagamento</p>
        <p className={styles.headerTotal}>Custo total</p>
        <p className={styles.headerDetails}></p>
      </li>
      <ul className={styles.main}>
        {trades.map((trade, index) => (
          <li
            key={trade.uuid}
            className={`${index % 2 === 0 ? styles.itemPair : styles.itemOdd}`}
          >
            <p className={styles.tradeDate}>
              {new Date(trade.tradeTimestamp + "Z").toLocaleString()}
            </p>
            {/* TODO: AJUSTAR HORÁRIO DEPOIS DO EVENTO */}
            <p className={styles.tradeQuantity}>{trade.totalItems}</p>
            <p className={styles.tradePaymentType}>
              {PaymentStringMetadata[trade.paymentTypeEnum].pt}
            </p>
            <p className={styles.tradeTotal}>
              R${trade.rechargeValue.toFixed(2)}
            </p>
            <Button
              className={styles.detailsButton}
              onClick={() =>
                formDispach({ type: "SET_UPDATE", payload: trade.uuid })
              }
            >
              <span>Detalhes</span>
            </Button>
          </li>
        ))}
      </ul>
      <PageSelect value={page.number} max={page.max} dispatch={pageDispatch} />
      {formState.show && (
        <PurchaseDetail hide={handleFormShow} uuid={formState.uuid} />
      )}
    </div>
  );
}

export default PurchaseLogs;
