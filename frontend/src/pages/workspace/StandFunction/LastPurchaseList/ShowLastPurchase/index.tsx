import Purchase from "@data/operations/Purchase";
import usePurchaseService from "@service/operations/usePurchaseService";
import { useEffect, useState } from "react";

function ShowLastPurchase({ uuid }: { uuid: string | undefined }) {
  const [purchase, setPurchase] = useState<Purchase | undefined>();
  const { getPurchase } = usePurchaseService();

  useEffect(() => {
    const fetchPurchase = async () => {
      if (uuid) {
        const purchase = await getPurchase(uuid);
        if (purchase) setPurchase(purchase);
      }
    };

    fetchPurchase();
  }, [uuid, getPurchase]);

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
