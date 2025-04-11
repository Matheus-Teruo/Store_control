import styles from "./LastPurchaseList.module.scss";
import { SummaryTrade } from "@data/operations/Trade";
import useTradeService from "@service/operations/useTradeService";
import { useEffect, useReducer, useState } from "react";
import ShowLastPurchase from "./ShowLastTrade";
import { formReducer, initialFormState } from "@reducer/formReducer";
import GlassBackground from "@/components/GlassBackground";

const PaymentRoleMetadata: Record<string, { label: string }> = {
  CASH: { label: "Dinheiro" },
  DEBIT: { label: "Débito" },
  CREDIT: { label: "Crédito" },
};

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
      <div className={styles.body}>
        <h3>Últimas vendas</h3>
        <ul className={styles.mainList}>
          <li key={"Header"} className={styles.header}>
            <p>Quantidade</p>
            <p>Total</p>
            <p>Pagamento</p>
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
              <p>R${trade.rechargeValue}</p>
              <p>{PaymentRoleMetadata[trade.paymentTypeEnum].label}</p>
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
      <GlassBackground onClick={setShow} />
    </>
  );
}

export default LastTradeList;
