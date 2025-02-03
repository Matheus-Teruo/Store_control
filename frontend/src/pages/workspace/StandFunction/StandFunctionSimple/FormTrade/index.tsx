import PaymentSelect from "@/components/PaymentSelect";
import Button from "@/components/utils/Button";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
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

type FormPurchaseProps = {
  reducer: [
    CreateTrade & { totalQuantity: number },
    React.Dispatch<TradeAction>,
  ];
};

function FormTrade({ reducer }: FormPurchaseProps) {
  const [productsRecord, setProductsRecord] = useState<
    Record<string, Omit<SummaryProduct, "uuid">>
  >({});
  const { addNotification } = useAlertsContext();
  const { createTrade } = useTradeService();
  const { getListProducts } = useProductService();
  const [state, dispatch] = reducer;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const purchase = await createTrade(createTradePayload(state));
    if (purchase) {
      addNotification({
        title: "Create Purchase Success",
        message: `Create purchase with ${purchase.items.length} itens diferent`,
        type: MessageType.OK,
      });
      dispatch({ type: "RESET" });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <ul>
          {state.items.map((item) => {
            const product = productsRecord[item.productUuid];
            return (
              <li key={item.productUuid}>
                <p>{product.productName}</p>
                <p>R${(item.unitPrice - item.discount).toFixed(2)}</p>
                <div
                  onClick={() =>
                    dispatch({
                      type: "REMOVE_ITEM",
                      payload: item.productUuid,
                    })
                  }
                >
                  deletar
                </div>
                <div
                  onClick={() =>
                    dispatch({
                      type: "DECREASE_ITEM",
                      payload: item.productUuid,
                    })
                  }
                >
                  -
                </div>
                <input
                  value={item.quantity}
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
                <div
                  onClick={() =>
                    dispatch({
                      type: "ADD_ITEM",
                      payload: { uuid: item.productUuid, ...product },
                    })
                  }
                >
                  +
                </div>
              </li>
            );
          })}
        </ul>
        <PaymentSelect
          payment={state.paymentTypeEnum}
          onChange={(e) =>
            dispatch({
              type: "SET_RECHARGE_TYPE",
              payload: e.target.value as PaymentType,
            })
          }
        />
        <Button type={ButtonHTMLType.Submit}>Finalizar</Button>
      </form>
    </div>
  );
}

export default FormTrade;
