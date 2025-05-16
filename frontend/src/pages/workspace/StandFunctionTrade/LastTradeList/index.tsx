import styles from "./LastPurchaseList.module.scss";
import { SummaryTrade } from "@data/operations/Trade";
import useTradeService from "@service/operations/useTradeService";
import { useEffect, useReducer, useState } from "react";
import ShowLastPurchase from "./ShowLastTrade";
import { formReducer, initialFormState } from "@reducer/formReducer";
import GlassBackground from "@/components/GlassBackground";
import { PaymentStringMetadata } from "@/components/selects/PaymentSelect/paymentMetadata";
import ComponentWrapper from "@/components/ComponentWrapper";

function LastTradeList({ setShow }: { setShow: () => void }) {
  const [trades, setTrades] = useState<SummaryTrade[]>([]);
  const [state, dispatch] = useReducer(formReducer, initialFormState);
  const [deletable, setDeletable] = useState<boolean>(false);
  const { getLast3Trades } = useTradeService();

  useEffect(() => {
    const fetchTrades = async () => {
      const trades = await getLast3Trades();
      if (trades) setTrades(trades);
    };
    fetchTrades();
  }, [getLast3Trades]);

  return (
    <>
      <ComponentWrapper>
        <div className={styles.body}>
          <h3>Últimas vendas</h3>
          <ul className={styles.mainList}>
            <li key={"Header"} className={styles.header}>
              <p>Quantidade</p>
              <p>Pagamento</p>
              <p>Total</p>
            </li>
            {trades.map((trade, index) => (
              <li
                key={trade.uuid}
                onClick={() => {
                  setDeletable(index === 0);
                  dispatch({ type: "SET_UPDATE", payload: trade.uuid });
                }}
              >
                <p>{trade.totalItems}</p>
                <p>{PaymentStringMetadata[trade.paymentTypeEnum].pt}</p>
                <p>R${trade.rechargeValue.toFixed(2)}</p>
              </li>
            ))}
          </ul>
          {state.show && (
            <ShowLastPurchase
              uuid={state.uuid}
              deletable={deletable}
              setShow={setShow}
            />
          )}
        </div>
      </ComponentWrapper>
      <GlassBackground onClick={setShow} />
    </>
  );
}

export default LastTradeList;
