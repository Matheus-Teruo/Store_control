import styles from "./LastPurchaseList.module.scss";
import { SummaryPurchase } from "@data/operations/Purchase";
import usePurchaseService from "@service/operations/usePurchaseService";
import { useEffect, useReducer, useState } from "react";
import ShowLastPurchase from "./ShowLastPurchase";
import { formReducer, initialFormState } from "@reducer/formReducer";
import GlassBackground from "@/components/GlassBackground";

function LastPurchaseList({ setShow }: { setShow: () => void }) {
  const [purchases, setPurchases] = useState<SummaryPurchase[]>([]);
  const [state, dispatch] = useReducer(formReducer, initialFormState);
  const [deletable, setDeletable] = useState<boolean>(false);
  const { getLast3Purchases } = usePurchaseService();

  useEffect(() => {
    const fetchPurchases = async () => {
      const purchases = await getLast3Purchases();
      if (purchases) setPurchases(purchases);
    };
    fetchPurchases();
  }, [getLast3Purchases]);

  return (
    <>
      <div className={styles.body}>
        <h3>Últimas vendas</h3>
        <ul className={styles.mainList}>
          <li key={"Header"} className={styles.header}>
            <p>Quantidade</p>
            <p>Total</p>
          </li>
          {purchases.map((purchase, index) => (
            <li
              key={purchase.uuid}
              onClick={() => {
                setDeletable(index === 0);
                dispatch({ type: "SET_UPDATE", payload: purchase.uuid });
              }}
            >
              <p>{purchase.totalItems}</p>
              <p>
                R${purchase.totalPurchaseCost - purchase.totalPurchaseDiscount}
              </p>
            </li>
          ))}
        </ul>
        {state.show && (
          <ShowLastPurchase uuid={state.uuid} deletable={deletable} />
        )}
      </div>
      <GlassBackground onClick={setShow} />
    </>
  );
}

export default LastPurchaseList;
