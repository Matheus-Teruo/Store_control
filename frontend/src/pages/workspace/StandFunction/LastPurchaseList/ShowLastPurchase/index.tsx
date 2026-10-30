import Button from "@/components/utils/Button";
import styles from "./ShowLastPurchase.module.scss";
import Purchase from "@data/operations/Purchase";
import usePurchaseService from "@service/operations/usePurchaseService";
import { useEffect, useState } from "react";

function ShowLastPurchase({
  uuid,
  deletable = false,
}: {
  uuid: string | undefined;
  deletable: boolean;
}) {
  const [purchase, setPurchase] = useState<Purchase | undefined>();
  const [waitingFetch, setWaitingFetch] = useState<boolean>(false);
  const { getPurchase } = usePurchaseService();
  const { deletePurchase } = usePurchaseService();

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
      try {
        setWaitingFetch(true)
        deletePurchase(purchase?.uuid);
      } finally {
        setWaitingFetch(false)
      }
    }
  };

  return (
    <div className={styles.body}>
      {purchase && (
        <>
          <h4>{purchase.onOrder ? "Ativo" : "Concluido"}</h4>
          <p className={styles.timestamp}>
            Data: {purchase.purchaseTimestamp.replace("T1", " ")}
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
              <Button onClick={handleDelete} loading={waitingFetch}>
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
