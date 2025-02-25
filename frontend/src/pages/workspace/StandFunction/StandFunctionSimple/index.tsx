import styles from "./StandFunctionSimple.module.scss";
import PageSelect from "@/components/selects/PageSelect";
import {
  isSeller,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryProduct } from "@data/stands/Product";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import useProductService from "@service/stand/useProductService";
import { useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/utils/Button";
import {
  initialTradeState,
  tradeReducer,
} from "@reducer/operation/tradeReducer";
import LastPurchaseList from "../LastPurchaseList";
import FormTrade from "./FormTrade";
import {
  HistorySVG,
  ImageSVG,
  MinusSVG,
  PlusSVG,
  ShoppingCartSVG,
} from "@/assets/svg";

function StandFunctionSimple() {
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const [state, dispatch] = useReducer(tradeReducer, initialTradeState);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [showCart, setShowCart] = useState<boolean>(false);
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
          user.summaryFunction ? user.summaryFunction.uuid : undefined,
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
    <div className={styles.body}>
      <div className={styles.headerBackground}>
        <div className={styles.header}>
          <Button onClick={() => setShowLast(true)}>
            <HistorySVG />
          </Button>
          <div className={styles.resumeCart} onClick={() => setShowCart(true)}>
            <ShoppingCartSVG />
            <p>{state.totalQuantity}</p>
            <p>R${state.rechargeValue}</p>
          </div>
        </div>
      </div>
      <ul className={styles.main}>
        {products.map((product, index) => (
          <li
            key={product.uuid}
            className={`${index % 2 === 0 ? styles.itemPair : styles.itemOdd}`}
          >
            <Button
              className={`${styles.modifierProduct} ${product.stock === 0 && styles.itemNull}`}
              onClick={() =>
                dispatch({
                  type: "DECREASE_ITEM",
                  payload: product.uuid,
                })
              }
            >
              <MinusSVG />
            </Button>
            <div className={styles.productFrame}>
              {product.productImg ? (
                <img src={product.productImg} />
              ) : (
                <ImageSVG />
              )}
            </div>
            <p>{product.productName}</p>
            <p>R${(product.price - product.discount).toFixed(2)}</p>
            <p>Estoque: {product.stock}</p>
            <Button
              className={`${styles.modifierProduct} ${product.stock === 0 && styles.itemNull}`}
              onClick={() =>
                dispatch({ type: "ADD_ITEM", payload: { ...product } })
              }
            >
              <PlusSVG />
            </Button>
          </li>
        ))}
      </ul>
      <PageSelect value={page.number} max={page.max} dispatch={pageDispatch} />
      <FormTrade
        reducer={[state, dispatch]}
        showCart={showCart}
        setShowCart={setShowCart}
      />
      {showLast && (
        <LastPurchaseList
          setShow={() => {
            setShowLast(false);
          }}
        />
      )}
    </div>
  );
}

export default StandFunctionSimple;
