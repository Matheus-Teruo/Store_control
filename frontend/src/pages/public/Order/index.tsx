import styles from "./Order.module.scss";
import { useHandleApiError } from "@/axios/handlerApiError";
import { SummaryProduct } from "@data/stands/Product";
import { getCustomerbyCard } from "@service/customer/customerService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Order() {
  const [cart, setCart] = useState<SummaryProduct[]>([]);
  const handleApiError = useHandleApiError();
  const { cardID } = useParams();

  useEffect(() => {
    const fetchStand = async () => {
      if (cardID !== undefined) {
        try {
          const products = await getCustomerbyCard(cardID);
          setCart(products);
        } catch (error) {
          handleApiError(error);
        }
      }
    };

    fetchStand();
  }, [handleApiError]);

  return (
    <div className={styles.background}>
      <div className={styles.main}>
        <ul>
          {cart.map((product) => (
            <li key={product.uuid}>
              <div className={styles.frame}>
                {
                  product.productImg !== null ? (
                    <img src={product.productImg} />
                  ) : (
                    <></>
                  )
                  // futuramente usar SVG padrão
                }
              </div>
              <div className={styles.tag}>
                <p>{product.productName}</p>
                <div className={styles.priceing}>
                  <p>R${(product.price - product.discount).toFixed(2)}</p>
                  <p>
                    <s>R${product.price.toFixed(2)}</s>
                  </p>
                </div>
                <p>Estoque: {product.stock}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Order;
