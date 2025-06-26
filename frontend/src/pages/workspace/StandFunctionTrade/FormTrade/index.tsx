import {
  CheckSVG,
  MinusSVG,
  PlusSVG,
  QRcodeScanSVG,
  TrashSVG,
  XSVG,
} from "@/assets/svg";
import styles from "./FormTrade.module.scss";
import PaymentSelect from "@/components/selects/PaymentSelect";
import Button from "@/components/utils/Button";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import Input from "@/components/utils/ProductInput";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { PaymentType } from "@data/operations/Recharge";
import { CreateTrade } from "@data/operations/Trade";
import { SummaryProduct } from "@data/stands/Product";
import {
  createTradePayload,
  TradeAction,
} from "@reducer/operation/tradeReducer";
import useTradeService from "@service/operations/useTradeService";
import useProductService from "@service/stand/useProductService";
import { useEffect, useState } from "react";
import GlassBackground from "@/components/GlassBackground";
import { createQRcodeImage } from "@/utils/createQRcode";
import QRcodeView from "@/components/QRcodeView";
import QRcodeReader from "@/components/QRcodeReader";
import { cartPacking, takeStandUuid } from "@/utils/cartCompactor";
import ComponentWrapper from "@/components/ComponentWrapper";

type FormTradeProps = {
  reducer: [
    CreateTrade & {
      totalQuantity: number;
      error: string;
      mode: "menu" | "stand";
      standList: string[];
    },
    React.Dispatch<TradeAction>,
  ];
  hide: () => void;
  type?: "normal" | "pre";
  isAdmin?: boolean;
};

const emptyProduct: Omit<SummaryProduct, "uuid"> = {
  productName: "productName",
  productCode: 1,
  summary: "",
  description: false,
  combo: false,
  price: 0,
  discount: 0,
  stock: 0,
  productImg: null,
  standUuid: "",
};

function FormTrade({
  reducer,
  hide,
  type = "normal",
  isAdmin = false,
}: FormTradeProps) {
  const [productsRecord, setProductsRecord] = useState<
    Record<string, Omit<SummaryProduct, "uuid">>
  >({});
  const [confirmFinalization, setConfirmFinalization] =
    useState<boolean>(false);
  const [waitingFetch, setWaitingFetch] = useState<boolean>(false);
  const [qrcode, setqrcode] = useState<string>("");
  const [qrcodeReader, setQrcodeReader] = useState<boolean>(false);
  const { addNotification } = useAlertsContext();
  const { createTrade } = useTradeService();
  const { getListProducts } = useProductService();
  const [state, dispatch] = reducer;

  useEffect(() => {
    const fetchProducts = async () => {
      if (type === "pre") {
        const newMap: Record<string, Omit<SummaryProduct, "uuid">> = {};
        for (const stand of state.standList) {
          const products = await getListProducts(stand);
          if (products) {
            const productsObject = products.reduce(
              (acc, product) => {
                const { uuid, ...rest } = product;
                acc[uuid] = rest;
                return acc;
              },
              {} as Record<string, Omit<SummaryProduct, "uuid">>,
            );
            Object.assign(newMap, productsObject);
          }
        }

        setProductsRecord(newMap);
      } else if (state.standUuid) {
        const products = await getListProducts(state.standUuid);
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
      }
    };

    fetchProducts();
  }, [getListProducts, state.standUuid, state.standList, type]);

  useEffect(() => {
    if (state.error !== "") {
      addNotification({
        title: "Erro ao carregar carrinho",
        message: state.error,
        type: MessageType.ERROR,
      });
      dispatch({ type: "CLEAR_ERROR" });
    }
  }, [state.error, addNotification, dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setWaitingFetch(true);
    if (type === "normal") {
      const purchase = await createTrade(createTradePayload(state));
      if (purchase) {
        addNotification({
          title: "Compra criada com sucesso",
          message: `Compra criada com ${purchase.items.length} items diferentes`,
          type: MessageType.OK,
        });
        setConfirmFinalization(false);
        hide();
        dispatch({ type: "RESET" });
      }
    } else {
      const jsonString = JSON.stringify(state);
      const image = createQRcodeImage(cartPacking(jsonString, productsRecord));
      setqrcode(image);
    }
    setWaitingFetch(false);
  };

  const handleCode = (value: boolean) => {
    if (!value) {
      setqrcode("");
    }
  };

  const handleCodeReader = async (value: string) => {
    const fetchStand = takeStandUuid(value);
    if (!isAdmin) {
      if (fetchStand !== state.standUuid) {
        addNotification({
          title: "Carrinho não pertence a esse estande",
          message: `Não pode criar carrinho com de estande diferente do estande do voluntário`,
          type: MessageType.WARNING,
        });
        return;
      }
    } else {
      const products = await getListProducts(fetchStand);
      if (products) {
        const productsObject = products.reduce(
          (acc, product) => {
            const { uuid, ...rest } = product;
            acc[uuid] = rest;
            return acc;
          },
          {} as Record<string, Omit<SummaryProduct, "uuid">>,
        );
        dispatch({
          type: "SET_CART",
          payload: { cart: value, products: productsObject },
        });
      }
      return;
    }
    dispatch({
      type: "SET_CART",
      payload: { cart: value, products: productsRecord },
    });
  };

  return (
    <>
      <ComponentWrapper>
        <div className={styles.main}>
          <h3>Carrinho</h3>
          <form onSubmit={handleSubmit}>
            <ul className={styles.itemList}>
              {state.items.length !== 0
                ? state.items.map((item) => {
                    const product =
                      Object.keys(productsRecord).length !== 0
                        ? productsRecord[item.productUuid]
                        : emptyProduct;
                    return (
                      <li
                        key={item.productUuid}
                        className={`${product.stock !== null && product.stock <= item.quantity && styles.OutOfStock}`}
                      >
                        <p>{product.productName}</p>
                        <Button
                          onClick={() =>
                            dispatch({
                              type: "REMOVE_ITEM",
                              payload: item.productUuid,
                            })
                          }
                        >
                          <TrashSVG size={16} />
                        </Button>
                        <Button
                          onClick={() =>
                            dispatch({
                              type: "DECREASE_ITEM",
                              payload: item.productUuid,
                            })
                          }
                        >
                          <MinusSVG size={16} />
                        </Button>
                        <Input
                          id={`product-${item.productUuid}`}
                          type="number"
                          value={item.quantity.toFixed(0)}
                          onChange={(e) =>
                            dispatch({
                              type: "ON_CHANGE_ITEM",
                              payload: {
                                uuid: item.productUuid,
                                quantity: parseInt(e.target.value),
                                stock: product.stock,
                              },
                            })
                          }
                        />
                        <Button
                          onClick={() =>
                            dispatch({
                              type: "ADD_ITEM",
                              payload: { uuid: item.productUuid, ...product },
                            })
                          }
                        >
                          <PlusSVG size={16} />
                        </Button>
                        <p className={styles.itemPrice}>
                          R$
                          {(
                            (item.unitPrice - item.discount) *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </li>
                    );
                  })
                : type === "normal" && (
                    <div className={styles.scanner}>
                      <Button onClick={() => setQrcodeReader(true)}>
                        <p>Ler Qrcode</p>
                        <QRcodeScanSVG />
                      </Button>
                    </div>
                  )}
            </ul>
            <li key={"Total"} className={styles.totalList}>
              <p>Total</p>
              <p />
              <p />
              <p className={styles.itemQuantity}>{state.totalQuantity}</p>
              <p />
              <p className={styles.itemPrice}>
                R$
                {state.rechargeValue.toFixed(2)}
              </p>
            </li>
            <PaymentSelect
              payment={state.paymentTypeEnum}
              onChange={(e) =>
                dispatch({
                  type: "SET_RECHARGE_TYPE",
                  payload: e.target.value as PaymentType,
                })
              }
            />
            {type === "pre" && (
              <p className={styles.communication}>
                Este carrinho é apenas uma pré ordem, para fazer o pedido pode
                gerar o QR code e apresentar para o caixa e fazer o pagamento
              </p>
            )}
            {confirmFinalization ? (
              <div className={styles.finalizationConfirmation}>
                <Button
                  onClick={() => setConfirmFinalization(false)}
                  className={styles.finalizationButton}
                >
                  <XSVG />
                </Button>
                <p>{type === "normal" ? "Finalizar" : "Gerar"}</p>
                <Button
                  className={styles.finalizationButton}
                  type={ButtonHTMLType.Submit}
                  loading={waitingFetch}
                >
                  <CheckSVG />
                </Button>
              </div>
            ) : (
              <div className={styles.finalization}>
                <Button
                  onClick={() => setConfirmFinalization(true)}
                  className={styles.finalizationButton}
                >
                  <p>{type === "normal" ? "Finalizar" : "Gerar QRcode"}</p>
                </Button>
              </div>
            )}
          </form>
        </div>
      </ComponentWrapper>
      <GlassBackground onClick={() => hide()} />
      {qrcode && (
        <QRcodeView
          code={qrcode}
          showCode={qrcode !== "" && qrcode !== "fail"}
          setShowCode={handleCode}
        />
      )}
      {qrcodeReader && (
        <QRcodeReader
          onChange={handleCodeReader}
          setClose={() => setQrcodeReader(false)}
        />
      )}
    </>
  );
}

export default FormTrade;
