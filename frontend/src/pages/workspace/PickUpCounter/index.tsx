import styles from "./PickUpCounter.module.scss";
import Logo from "@/assets/image/LogoStoreControl.png";
import { SummaryProduct } from "@data/stands/Product";
import { SummaryStand } from "@data/stands/Stand";
import { CustomerCard } from "@data/customers/Customer";
import useProductService from "@service/stand/useProductService";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/utils/Button";

import {
  CheckSVG,
  ImageSVG,
  MinusSVG,
  PlusSVG,
  QRcodeScanSVG,
} from "@/assets/svg";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import useCustomerService from "@service/customer/useCustomerService";
import useStandService from "@service/stand/useStandService";
import CardInput from "@/components/utils/CardInput";
import QRcodeReader from "@/components/QRcodeReader";
import activeConfig from "@/config/activeConfig";
import {
  initialPickUpCounterState,
  pickUpCounterReducer,
} from "@reducer/operation/pickUpCounterReducer";

enum CardStatus {
  NoCard = "NoCard",
  ValidCard = "ValidCard",
  InvalidCard = "InvalidCard",
}

function PickUpCounter() {
  const [customer, setCustomer] = useState<CustomerCard>();
  const [productsRecord, setProductsRecord] = useState<
    Record<string, Omit<SummaryProduct, "uuid">>
  >({});
  const [standsRecord, setStandsRecord] = useState<
    Record<string, Omit<SummaryStand, "uuid">>
  >({});
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [cardStatus, setCardStatus] = useState<CardStatus>(CardStatus.NoCard);
  const [card, setCard] = useState<string>("");
  const [state, dispatch] = useReducer(
    pickUpCounterReducer,
    initialPickUpCounterState,
  );
  const { addNotification } = useAlertsContext();
  const { getCustomerByCard } = useCustomerService();
  const { getListStands } = useStandService();
  const { getListProducts } = useProductService();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
      if (card && card.length === 15) {
        const customerResponse = await getCustomerByCard(card);
        if (customerResponse) {
          setCardStatus(CardStatus.ValidCard);
          setCustomer(customerResponse);
          dispatch({
            type: "SET_CART",
            payload: { purchases: customerResponse.purchases, cardId: "" },
          });
        } else {
          setCardStatus(CardStatus.InvalidCard);
        }
      }
    };

    fetchCustomer();
  }, [card, getCustomerByCard, navigate]);

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
      setCard(cardReaded);
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
    if (input.length !== 15) {
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
            <p>{card ? "Escanear Cartão" : "Escanear Outro Cartão"}</p>
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
                ? activeConfig.enableToken
                  ? "R$ " + (customer?.cardDebit || "0")
                  : "Cartão Ativo"
                : cardStatus === CardStatus.InvalidCard && "Cartão Desativado"}
            </p>
          </div>
          <div className={styles.cardFooter}>
            <div className={styles.cardActions}>
              {customer && cardStatus === CardStatus.ValidCard && (
                <>
                  <p>recargas: {customer?.recharges.length}</p>
                  <p>compras: {customer?.purchases.length}</p>
                </>
              )}
            </div>
            <span>store-control</span>
          </div>
        </div>
        {state.purchases.length !== 0 && (
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
              {state.purchases?.map((purchase, index) => (
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
                          <div className={styles.productName}>
                            <p>{item.productName} </p>
                            <span>qntd: {item.quantity}</span>
                          </div>
                          <div className={styles.delivered}>
                            <Button
                              onClick={() =>
                                dispatch({
                                  type: "DECREASE_DELIVERED_ITEM",
                                  payload: {
                                    purchaseUuid: purchase.uuid,
                                    uuid: item.productUuid,
                                  },
                                })
                              }
                            >
                              <MinusSVG size={18} />
                            </Button>
                            <input
                              type="number"
                              onChange={(e) =>
                                dispatch({
                                  type: "ON_CHANGE_DELIVERED_ITEM",
                                  payload: {
                                    purchaseUuid: purchase.uuid,
                                    uuid: item.productUuid,
                                    delivered: parseInt(e.target.value),
                                  },
                                })
                              }
                              value={item.delivered}
                            />
                            <Button
                              onClick={() =>
                                dispatch({
                                  type: "ADD_DELIVERED_ITEM",
                                  payload: {
                                    purchaseUuid: purchase.uuid,
                                    uuid: item.productUuid,
                                  },
                                })
                              }
                            >
                              <PlusSVG size={18} />
                            </Button>
                            <Button
                              onClick={() =>
                                dispatch({
                                  type: "COMPLETE_DELIVERED_ITEM",
                                  payload: {
                                    purchaseUuid: purchase.uuid,
                                    uuid: item.productUuid,
                                  },
                                })
                              }
                            >
                              <CheckSVG size={18} />
                            </Button>
                          </div>
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

export default PickUpCounter;
