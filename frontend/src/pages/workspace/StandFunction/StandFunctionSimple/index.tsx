import { useHandleApiError } from "@/axios/handlerApiError";
import PageSelect from "@/components/PageSelect";
import {
  isSeller,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryProduct } from "@data/stands/Product";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import { getProducts } from "@service/stand/productService";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/utils/Button";
import {
  initialTradeState,
  tradeReducer,
} from "@reducer/operation/tradeReducer";
import LastPurchaseList from "../LastPurchaseList";
import FormTrade from "./FormTrade";

function StandFunctionSimple() {
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const [state, dispatch] = useReducer(tradeReducer, initialTradeState);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [showLast, setShowLast] = useState<boolean>(false);
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
        navigate("/");
      }
    };
    fetchVoluntary();
  }, [user, page, navigate, handleApiError]);

  return (
    <div>
      <div>
        <Button onClick={() => setShowLast(true)}>Ultima Troca</Button>
        {showLast && (
          <>
            <div />
            <LastPurchaseList />
          </>
        )}
      </div>
      <ul>
        {products.map((product) => (
          <li key={product.uuid}>
            <div
              onClick={() =>
                dispatch({
                  type: "DECREASE_ITEM",
                  payload: product.uuid,
                })
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
      <FormTrade reducer={[state, dispatch]} />
    </div>
  );
}

export default StandFunctionSimple;
