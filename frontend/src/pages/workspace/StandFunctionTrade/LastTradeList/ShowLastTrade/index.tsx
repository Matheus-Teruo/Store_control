import Button from "@/components/utils/Button";
import styles from "./ShowLastPurchase.module.scss";
import Trade from "@data/operations/Trade";
import { useEffect, useState } from "react";
import useTradeService from "@service/operations/useTradeService";
import activeConfig, { fixedCardID } from "@/config/activeConfig";

type ShowLastTradeProps = {
  uuid: string | undefined;
  deletable: boolean;
  setShow: () => void;
};

function ShowLastTrade({
  uuid,
  deletable = false,
  setShow,
}: ShowLastTradeProps) {
  const [waitingFetch, setWaitingFetch] = useState<
    "create/update" | "delete" | ""
  >("");
  const [trade, setTrade] = useState<Trade | undefined>();
  const { readTrade, deleteTrade } = useTradeService();

  useEffect(() => {
    const fetchPurchase = async () => {
      if (uuid) {
        const trade = await readTrade(uuid);
        if (trade) setTrade(trade);
      }
    };

    fetchPurchase();
  }, [uuid, readTrade]);

  const handleDelete = async () => {
    if (!activeConfig.enableCard) {
      if (uuid) {
        setWaitingFetch("delete");
        await deleteTrade(fixedCardID, uuid);
        setShow();
      }
    } else {
      // TODO: create card logic
    }
    setWaitingFetch("");
  };

  return (
    <div className={styles.body}>
      {trade && (
        <>
          <h4>{trade.onOrder ? "Ativo" : "Concluido"}</h4>
          <p className={styles.timestamp}>
            Data: {trade.tradeTimeStamp.replace("T", " ")}
          </p>
          <ul>
            <li key={"header"} className={styles.listHeader}>
              <p>Produtos</p>
              <p>Quantidade</p>
              <p>Total</p>
            </li>
            {trade.items.map((item) => (
              <li key={item.productUuid}>
                <p>{item.productName}</p>
                <p>{item.quantity}</p>
                <p>{(item.unitPrice - item.discount) * item.quantity}</p>
              </li>
            ))}
          </ul>
          {deletable && (
            <div className={styles.delete}>
              <Button
                onClick={handleDelete}
                loading={waitingFetch === "delete"}
              >
                <p>Deletar</p>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ShowLastTrade;
