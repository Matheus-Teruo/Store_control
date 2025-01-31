import { PurchaseOrder } from "@data/operations/Purchase";
import styles from "./Order.module.scss";
import { useHandleApiError } from "@/axios/handlerApiError";
import { getCustomerbyCard } from "@service/customer/customerService";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getListProducts } from "@service/stand/productService";
import { SummaryProduct } from "@data/stands/Product";

function Order() {
  const [cart, setCart] = useState<PurchaseOrder[]>([]);
  const [productsRecord, setProductsRecord] = useState<
    Record<string, Omit<SummaryProduct, "uuid">>
  >({});
  const handleApiError = useHandleApiError();
  const navigate = useNavigate();
  const { cardID } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getListProducts();
        const productsObject = products.reduce(
          (acc, product) => {
            const { uuid, ...rest } = product;
            acc[uuid] = rest;
            return acc;
          },
          {} as Record<string, Omit<SummaryProduct, "uuid">>,
        );
        setProductsRecord(productsObject);
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchProducts();
  }, [handleApiError]);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (cardID !== undefined) {
        try {
          const customer = await getCustomerbyCard(cardID);
          setCart(customer.purchases);
        } catch (error) {
          handleApiError(error);
          navigate("/");
        }
      }
    };

    fetchCustomer();
  }, [cardID, handleApiError, navigate]);

  return (
    <div className={styles.background}>
      <div className={styles.headerBackground}></div>
      <div className={styles.main}>
        <ul>
          {cart?.map((purchase) =>
            purchase.items.map((item) => {
              const product = productsRecord[item.productUuid];
              return (
                <li key={item.productUuid}>
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
                    <p>{item.productName}</p>
                    <p>quantidade: {item.quantity}</p>
                    <p>entregue: {item.delivered}</p>
                  </div>
                </li>
              );
            }),
          )}
        </ul>
      </div>
    </div>
  );
}

export default Order;
