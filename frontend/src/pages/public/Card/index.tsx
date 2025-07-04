import styles from "./Card.module.scss";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { SummaryProduct } from "@data/stands/Product";
import { CustomerCard } from "@data/customers/Customer";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import useCustomerService from "@service/customer/useCustomerService";
import useProductService from "@service/stand/useProductService";
import Button from "@/components/utils/Button";
import QRcodeReader from "@/components/QRcodeReader";
import CardInput from "@/components/utils/CardInput";
import { ImageSVG, QRcodeScanSVG } from "@/assets/svg";
import Logo from "@/assets/image/LogoStoreControl.png";
import { PaymentStringMetadata } from "@/components/selects/PaymentSelect/paymentMetadata";
import useStandService from "@service/stand/useStandService";
import { SummaryStand } from "@data/stands/Stand";

enum CardStatus {
  NoCard = "NoCard",
  ValidCard = "ValidCard",
  InvalidCard = "InvalidCard",
}

function Card() {
  const [customer, setCustomer] = useState<CustomerCard>();
  const [productsRecord, setProductsRecord] = useState<
    Record<string, Omit<SummaryProduct, "uuid">>
  >({});
  const [standsRecord, setStandsRecord] = useState<
    Record<string, Omit<SummaryStand, "uuid">>
  >({});
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [cardStatus, setCardStatus] = useState<CardStatus>(CardStatus.NoCard);
  const { addNotification } = useAlertsContext();
  const { getCustomerByCard } = useCustomerService();
  const { getListStands } = useStandService();
  const { getListProducts } = useProductService();
  const navigate = useNavigate();
  const { cardID } = useParams();
  const [card, setCard] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    const fetchCustomer = async () => {
      if (cardID && cardID.length === 15) {
        setCard(cardID);
        const customerResponse = await getCustomerByCard(cardID);
        if (customerResponse) {
          localStorage.setItem("userCardId", cardID);
          setCardStatus(CardStatus.ValidCard);
          setCustomer(customerResponse);
        } else {
          setCardStatus(CardStatus.InvalidCard);
        }
      } else if (cardID === undefined) {
        const localCard = localStorage.getItem("userCardId") || "";
        if (localCard !== "") {
          navigate(`/card/${localCard}`, { replace: true });
        }
      }
    };

    fetchCustomer();
  }, [cardID, getCustomerByCard, navigate]);

  useEffect(() => {
    const fetchAssociations = async () => {
      const associations = await getListStands();
      if (associations) {
        const associationsObject = associations.reduce(
          (acc, association) => {
            const { uuid, ...rest } = association;
            acc[uuid] = rest;
            return acc;
          },
          {} as Record<string, Omit<SummaryStand, "uuid">>,
        );
        setStandsRecord(associationsObject);
      }
    };
    fetchAssociations();
  }, [getListStands]);

  const handleQRcode = (value: string) => {
    const cardReaded = value.split("/").at(-1);
    if (cardReaded && cardReaded.length === 15) {
      navigate(`/card/${cardReaded}`, { replace: true });
    } else {
      addNotification({
        title: "Erro no código do QRcode",
        message: "QRcode não é de um cartão",
        type: MessageType.WARNING,
      });
    }
  };

  function handleCardId(input: string) {
    if (input.length <= 15) setCard(input);
    if (input.length === 15) {
      navigate(`/card/${input}`, { replace: true });
    } else {
      setCardStatus(CardStatus.NoCard);
    }
  }

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
      <div className={styles.headerBackground}>
        <div className={styles.header}>
          <div />
          <Button onClick={() => setShowScanner(true)}>
            <p>
              {location.pathname === "/card"
                ? "Escanear Cartão"
                : "Escanear Outro Cartão"}
            </p>
            <QRcodeScanSVG />
          </Button>
        </div>
      </div>
      <div className={styles.main}>
        <div
          className={`${styles.card} ${
            cardStatus === CardStatus.NoCard
              ? styles.noCard
              : cardStatus === CardStatus.ValidCard
                ? styles.ValidCard
                : cardStatus === CardStatus.InvalidCard && styles.InvalidCard
          }`}
        >
          <div className={styles.cardHeader}>
            <CardInput
              onChange={(e) => handleCardId(e.target.value)}
              value={card}
            />
            <img
              src={Logo}
              alt="Logo: imagem circular com um rosto de raposa no meio"
            />
          </div>
          <div className={styles.cardMain}>
            <p>
              {cardStatus === CardStatus.ValidCard
                ? "R$ " + customer?.card.debit
                : cardStatus === CardStatus.InvalidCard && "Cartão Inválido"}
            </p>
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.cardActions}>
              {customer && (
                <>
                  <p>recargas: {customer?.recharges.length}</p>
                  <p>compras: {customer?.purchases.length}</p>
                </>
              )}
            </div>
            <span>store-control</span>
          </div>
        </div>
        {customer?.recharges.length !== 0 && (
          <>
            <div className={styles.actionHeader}>
              <p>Recargas</p>
            </div>
            <li key="rechargeHeader" className={styles.rechargesListHeader}>
              <p>Tempo</p>
              <p>Pagamento</p>
              <p>Total</p>
            </li>
            <ul className={styles.rechargesList}>
              {customer?.recharges?.map((recharge, index) => (
                <li
                  key={recharge.uuid}
                  className={index % 2 === 0 ? styles.itemPair : styles.itemOdd}
                >
                  <p>
                    {new Date(
                      recharge.rechargeTimestamp + "Z",
                    ).toLocaleString()}
                  </p>
                  <p>{PaymentStringMetadata[recharge.paymentTypeEnum]?.pt}</p>
                  <p>R$ {recharge.rechargeValue.toFixed(2)}</p>
                </li>
              ))}
            </ul>
          </>
        )}
        {customer?.purchases.length !== 0 && (
          <>
            <div className={styles.actionHeader}>
              <p>Compras</p>
            </div>
            <li key="purchaseHeader" className={styles.purhcasesListHeader}>
              <p>Tempo</p>
              <p>Estande</p>
              <p>Status</p>
            </li>
            <ul className={styles.purchasesList}>
              {customer?.purchases?.map((purchase, index) => (
                <li
                  key={purchase.uuid}
                  className={`${styles.purchaseItem} ${index % 2 === 0 ? styles.itemPair : styles.itemOdd}`}
                >
                  <div
                    className={`${styles.purchaseSpec} ${index % 2 === 0 ? styles.itemPair : styles.itemOdd}`}
                  >
                    <p>
                      {new Date(
                        purchase.purchaseTimestamp + "Z",
                      ).toLocaleString()}
                    </p>
                    <p>{standsRecord[purchase.standUuid].standName}</p>
                    <p>{purchase.onOrder ? "Ativo" : "Finalizada"}</p>
                  </div>
                  <ul className={styles.itemList}>
                    {purchase.items.map((item) => {
                      const product = productsRecord[item.productUuid];
                      return (
                        <li
                          key={item.productUuid}
                          className={`${item.delivered === item.quantity && styles.itemEmpty}`}
                        >
                          <div
                            className={`${styles.frame} ${item.delivered === item.quantity && styles.frameEmpty}`}
                          >
                            {product &&
                              (product?.productImg ? (
                                <img
                                  src={product.productImg}
                                  className={styles.imageFrame}
                                />
                              ) : (
                                <ImageSVG />
                              ))}
                          </div>
                          <p className={styles.productName}>
                            {item.productName}
                          </p>
                          <p className={styles.quantity}>
                            {item.quantity}/{item.delivered}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {showScanner && (
        <QRcodeReader
          onChange={handleQRcode}
          setClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}

export default Card;
