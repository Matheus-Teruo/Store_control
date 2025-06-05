import styles from "./TradeLogs.module.scss";
import { useCallback, useEffect, useReducer, useState } from "react";
import { SummaryTrade } from "@data/operations/Trade";
import Button from "@/components/utils/Button";
import PageSelect from "@/components/selects/PageSelect";
import useTradeService from "@service/operations/useTradeService";
import TradeDetail from "./TradeDetail";
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
import useVoluntaryService from "@service/voluntary/useVoluntaryService";
import { SummaryVoluntary } from "@data/volunteers/Voluntary";

function TradeLogs() {
  const [trades, setTrades] = useState<SummaryTrade[]>([]);
  const [volunteersRecord, setVolunteersRecord] = useState<
    Record<string, Omit<SummaryVoluntary, "uuid">>
  >({});
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [formState, formDispach] = useReducer(formReducer, initialFormState);
  const [modeAdmin, setModeAdmin] = useState<boolean>(false);
  const { getTrades } = useTradeService();
  const { getListVolunteers } = useVoluntaryService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssociations = async () => {
      const products = await getListVolunteers();
      if (products) {
        const productsObject = products.reduce(
          (acc, product) => {
            const { uuid, ...rest } = product;
            acc[uuid] = rest;
            return acc;
          },
          {} as Record<string, Omit<SummaryVoluntary, "uuid">>,
        );
        setVolunteersRecord(productsObject);
      }
    };
    fetchAssociations();
  }, [getListVolunteers]);

  const fetchTrades = useCallback(
    async (modeAmin: boolean) => {
      if (isManeger(user)) {
        const response = await getTrades(
          modeAmin ? undefined : user.summaryFunction?.uuid,
          page.number,
          undefined,
          "tradeTimeStamp,asc",
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
        <p>Data</p>
        <p>Voluntário</p>
        <p>Quantidade de itens</p>
        <p>Método de pagamento</p>
        <p>Custo total</p>
        <p className={styles.propAligned}></p>
      </li>
      <ul className={styles.main}>
        {trades.map((trade, index) => (
          <li
            key={trade.uuid}
            className={`${index % 2 === 0 ? styles.itemPair : styles.itemOdd}`}
          >
            <p>{new Date(trade.tradeTimeStamp + "Z").toLocaleString()}</p>
            {/* TODO: AJUSTAR HORÁRIO DEPOIS DO EVENTO */}
            <p>{volunteersRecord[trade.voluntaryUuid].fullname}</p>
            <p>{trade.totalItems}</p>
            <p>{PaymentStringMetadata[trade.paymentTypeEnum].pt}</p>
            <p>R${trade.rechargeValue.toFixed(2)}</p>
            <Button
              className={styles.tradeView}
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
        <TradeDetail hide={handleFormShow} uuid={formState.uuid} />
      )}
    </div>
  );
}

export default TradeLogs;
