import { useHandleApiError } from "@/axios/handlerApiError";
import { SummaryPurchase } from "@data/operations/Purchase";
import { getLast3Purchases } from "@service/operations/purchaseService";
import { useEffect, useReducer, useState } from "react";
import ShowLastPurchase from "./ShowLastPurchase";
import { formReducer, initialFormState } from "@reducer/formReducer";

function LastPurchaseList() {
  const [purchases, setPurchases] = useState<SummaryPurchase[]>([]);
  const [state, dispatch] = useReducer(formReducer, initialFormState);
  const handleApiError = useHandleApiError();

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const purchases = await getLast3Purchases();
        setPurchases(purchases);
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchPurchases();
  }, [handleApiError]);

  return (
    <div>
      <h2>ultimas vendas</h2>
      <ul>
        {purchases.map((purchase) => (
          <li
            key={purchase.uuid}
            onClick={() =>
              dispatch({ type: "SET_UPDATE", payload: purchase.uuid })
            }
          >
            <p>{purchase.totalItems}</p>
            <p>{purchase.totalPurchaseCost - purchase.totalPurchaseDiscount}</p>
          </li>
        ))}
      </ul>
      {state.show && <ShowLastPurchase uuid={state.uuid} />}
    </div>
  );
}

export default LastPurchaseList;
