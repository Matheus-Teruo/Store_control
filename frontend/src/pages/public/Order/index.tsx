import { PurchaseOrder } from "@data/operations/Purchase";
import styles from "./Order.module.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useProductService from "@service/stand/useProductService";
import { SummaryProduct } from "@data/stands/Product";
import useCustomersApi from "@service/customer/useCustomerService";

function Order() {
  const [cart, setCart] = useState<PurchaseOrder[]>([]);
  const [productsRecord, setProductsRecord] = useState<
    Record<string, Omit<SummaryProduct, "uuid">>
  >({});
  const { getCustomerByCard } = useCustomersApi();
  const { getListProducts } = useProductService();
  const navigate = useNavigate();
  const { cardID } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getListProducts();
      if (products) {
        const productsObject = products.reduce(
          (acc, product) => {
            const { uuid, ...rest } = product;
            acc[uuid] = rest;
            return acc;
          },
          {} as Record<string, Omit<SummaryProduct, "uuid">>,
        );
        setProductsRecord(productsObject);
      }
    };

    fetchProducts();
  }, [getListProducts]);

  useEffect(() => {
    const fetchCustomer = async () => {
      if (cardID !== undefined) {
        const customer = await getCustomerByCard(cardID);
        if (customer) {
          setCart(customer.purchases);
        } else {
          navigate("/");
        }
      }
    };

    fetchCustomer();
  }, [cardID, getCustomerByCard, navigate]);

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
