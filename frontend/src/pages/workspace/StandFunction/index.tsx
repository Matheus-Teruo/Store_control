import PageSelect from "@/components/PageSelect";
import {
  isSeller,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryProduct } from "@data/stands/Product";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import {
  initialPurchaseState,
  purchaseReducer,
} from "@reducer/operation/purchaseReducer";
import useProductService from "@service/stand/useProductService";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import OrderCard from "../CashierFunction/OrderCard";
import { VoluntaryRole } from "@data/volunteers/Voluntary";
import FormPurchase from "./FormPurchase";
import Button from "@/components/utils/Button";
import LastPurchaseList from "./LastPurchaseList";

function StandFunction() {
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const [state, dispatch] = useReducer(purchaseReducer, initialPurchaseState);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [showLast, setShowLast] = useState<boolean>(false);
  const { getProducts } = useProductService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVoluntary = async () => {
      if (
        isUserLogged(user) &&
        isSeller(user.summaryFunction, user.voluntaryRole)
      ) {
        const response = await getProducts(
          undefined,
          user.voluntaryRole === VoluntaryRole.ADMIN
            ? undefined
            : user.summaryFunction.uuid,
          page.number,
        );
        if (response) setProducts(response.content);
      } else if (
        isUserUnlogged(user) ||
        (user && !isSeller(user.summaryFunction, user.voluntaryRole))
      ) {
        navigate("/");
      }
    };
    fetchVoluntary();
  }, [user, page, navigate, getProducts]);

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
      <div>
        <OrderCard
          value={state.orderCardId}
          onChange={(e) =>
            dispatch({ type: "SET_CARD_ID", payload: e.target.value })
          }
        />
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
      <FormPurchase reducer={[state, dispatch]} />
    </div>
  );
}

export default StandFunction;
