import styles from "./Card.module.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useProductService from "@service/stand/useProductService";
import { SummaryProduct } from "@data/stands/Product";
import useCustomersApi from "@service/customer/useCustomerService";
import { CustomerCard } from "@data/customers/Customer";

function Card() {
  const [customer, setCustomer] = useState<CustomerCard>();
  const [productsRecord, setProductsRecord] = useState<
    Record<string, Omit<SummaryProduct, "uuid">>
  >({});
  const { getCustomerByCard } = useCustomersApi();
  const { getListProducts } = useProductService();
  const navigate = useNavigate();
  const { cardID } = useParams();

  useEffect(() => {
    const fetchCustomer = async () => {
      if (cardID !== undefined) {
        const customerResponse = await getCustomerByCard(cardID);
        if (customerResponse) {
          setCustomer(customerResponse);
        } else {
          navigate("/");
        }
      }
    };

    fetchCustomer();
  }, [cardID, getCustomerByCard, navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      if (customer) {
        const allProductsRecord: Record<
          string,
          Omit<SummaryProduct, "uuid">
        > = {};

        for (const purchase of customer.purchases) {
          const products = await getListProducts(purchase.standUuid);
          if (products) {
            products.forEach((product) => {
              const { uuid, ...rest } = product;
              allProductsRecord[uuid] = rest;
            });
          }
        }
        setProductsRecord(allProductsRecord);
      }
    };

    fetchProducts();
  }, [customer, getListProducts]);

  return (
    <div className={styles.background}>
      <div className={styles.headerBackground}></div>
      <div className={styles.main}>
        <ul>
          {customer?.purchases?.map((purchase) =>
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

export default Card;
