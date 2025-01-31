import { useHandleApiError } from "@/axios/handlerApiError";
import Button from "@/components/utils/Button";
import { ButtonHTMLType } from "@/components/utils/Button/ButtonHTMLType";
import { isSeller, isUserLogged } from "@/utils/checkAuthentication";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import { CreatePurchase } from "@data/operations/Purchase";
import { SummaryProduct } from "@data/stands/Product";
import {
  createPurchasePayload,
  PurchaseAction,
} from "@reducer/operation/purchaseReducer";
import { createPurchase } from "@service/operations/purchaseService";
import { getListProducts } from "@service/stand/productService";
import { useEffect, useState } from "react";

type FormPurchaseProps = {
  reducer: [
    CreatePurchase & { totalPrice: number; totalQuantity: number },
    React.Dispatch<PurchaseAction>,
  ];
};

function FormPurchase({ reducer }: FormPurchaseProps) {
  const [productsRecord, setProductsRecord] = useState<
    Record<string, Omit<SummaryProduct, "uuid">>
  >({});
  const { addNotification } = useAlertsContext();
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const [state, dispatch] = reducer;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUserLogged(user) && isSeller(user.summaryFunction)) {
      try {
        const purchase = await createPurchase(createPurchasePayload(state));
        addNotification({
          title: "Create Purchase Success",
          message: `Create purchase with ${purchase.items.length} itens diferent`,
          type: MessageType.OK,
        });
        dispatch({ type: "RESET" });
      } catch (error) {
        handleApiError(error);
      }
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
                <p>R${(product.price - product.discount).toFixed(2)}</p>
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
                      payload: product.standUuid,
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
        <Button type={ButtonHTMLType.Submit}>Finalizar</Button>
      </form>
    </div>
  );
}

export default FormPurchase;
