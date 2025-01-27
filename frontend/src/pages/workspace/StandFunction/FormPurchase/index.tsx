import { useHandleApiError } from "@/axios/handlerApiError";
import { CreatePurchase } from "@data/operations/Purchase";
import { SummaryProduct } from "@data/stands/Product";
import { PurchaseAction } from "@reducer/operation/purchaseReducer";
import { getListProducts } from "@service/stand/productService";
import { useEffect, useState } from "react";

type FormPurchaseProps = {
  reducer: [CreatePurchase, React.Dispatch<PurchaseAction>];
};

function FormPurchase({ reducer }: FormPurchaseProps) {
  const [productsRecord, setProductsRecord] = useState<
    Record<string, Omit<SummaryProduct, "uuid">>
  >({});
  const handleApiError = useHandleApiError();
  const [state, dispatch] = reducer;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getListProducts();
        const productsObject = products.reduce(
          (acc, product) => {
            const { uuid, ...rest } = product; // Extrai o uuid e o resto do objeto
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

  return (
    <div>
      <form>
        <ul>
          {state.items.map((item) => {
            const product = productsRecord[item.productUuid];
            return (
              <li key={item.productUuid}>
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
                <p>{product.productName}</p>
                <p>R${(product.price - product.discount).toFixed(2)}</p>
                <p>quantidade: {product.stock}</p>
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
        <div></div>
      </form>
    </div>
  );
}

export default FormPurchase;
