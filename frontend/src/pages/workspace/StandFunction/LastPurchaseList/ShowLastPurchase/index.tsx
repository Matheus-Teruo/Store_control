import { useHandleApiError } from "@/axios/handlerApiError";
import Purchase from "@data/operations/Purchase";
import { getPurchase } from "@service/operations/purchaseService";
import { useEffect, useState } from "react";

function ShowLastPurchase({ uuid }: { uuid: string | undefined }) {
  const [purchase, setPurchase] = useState<Purchase | undefined>();
  const handleApiError = useHandleApiError();

  useEffect(() => {
    const fetchPurchase = async () => {
      if (uuid) {
        try {
          const purchase = await getPurchase(uuid);
          setPurchase(purchase);
        } catch (error) {
          handleApiError(error);
        }
      }
    };

    fetchPurchase();
  }, [uuid, handleApiError]);

  return (
    <div>
      {purchase && (
        <>
          <p>{purchase.onOrder}</p>
          <p>{purchase.purchaseTimeStamp}</p>
          <ul>
            {purchase.items.map((item) => (
              <li key={item.productUuid}>
                <p>{item.productName}</p>
                <p>{item.quantity}</p>
                <p>{item.unitPrice}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ShowLastPurchase;
