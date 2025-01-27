import { useHandleApiError } from "@/axios/handlerApiError";
import PageSelect from "@/components/PageSelect";
import {
  isSeller,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useUserContext";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryProduct } from "@data/stands/Product";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import {
  initialPurchaseState,
  purchaseReducer,
} from "@reducer/operation/purchaseReducer";
import { createPurchase } from "@service/operations/purchaseService";
import { getProducts } from "@service/stand/productService";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";

function Stand() {
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const [state, dispatch] = useReducer(purchaseReducer, initialPurchaseState);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const { addNotification } = useAlertsContext();
  const handleApiError = useHandleApiError();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (
        isUserLogged(user) &&
        isSeller(user.summaryFunction, user.voluntaryRole)
      ) {
        try {
          const response = await getProducts(
            undefined,
            user.summaryFunction ? user.summaryFunction.uuid : undefined,
            page.number,
          );
          setProducts(response.content);
        } catch (error) {
          handleApiError(error);
        }
      } else if (
        isUserUnlogged(user) ||
        (user && !isSeller(user.summaryFunction, user.voluntaryRole))
      ) {
        navigate("/login");
      }
    };
    fetchVoluntary();
  }, [user, page, navigate, handleApiError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isUserLogged(user) && isSeller(user.summaryFunction)) {
      try {
        const purchase = await createPurchase(state);
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
      <div>page</div>
      <ul>
        {products.map((product) => (
          <li key={product.uuid}>
            <div
              onClick={() =>
                dispatch({ type: "DECREASE_ITEM", payload: product.uuid })
              }
            >
              -
            </div>
            <div>
              {
                product.productImg ? <img src={product.productImg} /> : <></>
                // futuramente usar SVG padrão
              }
            </div>
            <div>
              <p>{product.productName}</p>
              <p>R${(product.price - product.discount).toFixed(2)}</p>
              <p>Estoque: {product.stock}</p>
            </div>
            <div
              onClick={() =>
                dispatch({ type: "ADD_ITEM", payload: { ...product } })
              }
            >
              +
            </div>
          </li>
        ))}
      </ul>
      <PageSelect value={page.number} max={page.max} dispatch={pageDispatch} />
      <div onClick={handleSubmit}>Finalizar</div>
    </div>
  );
}

export default Stand;
