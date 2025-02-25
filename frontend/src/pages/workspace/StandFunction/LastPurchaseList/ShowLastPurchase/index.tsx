import Button from "@/components/utils/Button";
import styles from "./ShowLastPurchase.module.scss";
import Purchase from "@data/operations/Purchase";
import usePurchaseService from "@service/operations/usePurchaseService";
import { useEffect, useState } from "react";
import useTradeService from "@service/operations/useTradeService";

function ShowLastPurchase({
  uuid,
  deletable = false,
}: {
  uuid: string | undefined;
  deletable: boolean;
}) {
  const [purchase, setPurchase] = useState<Purchase | undefined>();
  const { getPurchase } = usePurchaseService();
  const { deleteTrade } = useTradeService();

  useEffect(() => {
    const fetchPurchase = async () => {
      if (uuid) {
        const purchase = await getPurchase(uuid);
        if (purchase) setPurchase(purchase);
      }
    };

    fetchPurchase();
  }, [uuid, getPurchase]);

  const handleDelete = () => {
    if (purchase) {
      deleteTrade(purchase?.uuid);
    }
  };

  return (
    <div className={styles.body}>
      {purchase && (
        <>
          <h4>{purchase.onOrder ? "Ativo" : "Concluido"}</h4>
          <p className={styles.timestamp}>
            Data: {purchase.purchaseTimeStamp.replace("T1", " ")}
          </p>
          <ul>
            <li key={"header"} className={styles.listHeader}>
              <p>Produtos</p>
              <p>Quantidade</p>
              <p>Total</p>
            </li>
            {purchase.items.map((item) => (
              <li key={item.productUuid}>
                <p>{item.productName}</p>
                <p>{item.quantity}</p>
                <p>{(item.unitPrice - item.discount) * item.quantity}</p>
              </li>
            ))}
          </ul>
          {deletable && (
            <div className={styles.delete}>
              <Button onClick={handleDelete}>
                <p>Deletar</p>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ShowLastPurchase;
