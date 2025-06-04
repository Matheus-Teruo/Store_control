import styles from "./StandFunctionTrade.module.scss";
import PageSelect from "@/components/selects/PageSelect";
import {
  isAdmin,
  isSeller,
  isUserLogged,
  isUserUnlogged,
} from "@/utils/checkAuthentication";
import { useUserContext } from "@context/UserContext/useUserContext";
import { SummaryProduct } from "@data/stands/Product";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import useProductService from "@service/stand/useProductService";
import { useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/utils/Button";
import {
  initialTradeState,
  tradeReducer,
} from "@reducer/operation/tradeReducer";
import LastTradeList from "./LastTradeList";
import FormTrade from "./FormTrade";
import {
  FilterSVG,
  HistorySVG,
  ImageSVG,
  MinusSVG,
  PlusSVG,
  ShoppingCartSVG,
} from "@/assets/svg";
import StandSelect from "@/components/selects/StandSelect";

function StandFunctionSimple() {
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const [selectedStand, setSelectedStand] = useState<string | undefined>();
  const [state, dispatch] = useReducer(tradeReducer, initialTradeState);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showLast, setShowLast] = useState<boolean>(false);
  const [modeAdmin, setModeAdmin] = useState<boolean>(false);
  const { getProducts } = useProductService();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const fetchProducts = useCallback(
    async (requestMode: boolean) => {
      if (
        isUserLogged(user) &&
        isSeller(user.summaryFunction, user.voluntaryRole)
      ) {
        const response = await getProducts(
          requestMode ? selectedStand : user.summaryFunction.uuid,
          undefined,
          undefined,
          page.number,
        );
        if (response) {
          setProducts(response.content);
          pageDispatch({
            type: "SET_PAGE_MAX",
            payload: response.page.totalPages,
          });
          dispatch({ type: "SET_MODE", payload: "stand" });
        }
      }
    },
    [user, page.number, selectedStand, getProducts],
  );

  useEffect(() => {
    setSelectedStand(state.standUuid);
  }, [state.standUuid]);

  useEffect(() => {
    if (fetchProducts && user) {
      const admin = isAdmin(user);
      if (admin) {
        setModeAdmin(true);
        if (user.summaryFunction !== null && !modeAdmin) {
          setSelectedStand(user.summaryFunction!.uuid);
          fetchProducts(false);
        } else {
          fetchProducts(true);
        }
      } else {
        fetchProducts(false);
      }
      if (
        isUserUnlogged(user) ||
        (user && !isSeller(user.summaryFunction, user.voluntaryRole))
      ) {
        navigate("/");
      }
    }
  }, [user, navigate, fetchProducts, modeAdmin]);

  const handleShowTrade = () => {
    setShowCart(false);
    fetchProducts(modeAdmin);
  };

  const handleShowLastTrade = () => {
    setShowLast(false);
    fetchProducts(modeAdmin);
  };

  return (
    <div className={styles.body}>
      <div className={styles.headerBackground}>
        <div className={styles.header}>
          {isAdmin(user) && (
            <div className={styles.filter}>
              <p className={styles.title}>Modo Admin</p>
              <div className={styles.filterSelect}>
                <FilterSVG size={16} />
                <StandSelect
                  value={selectedStand}
                  onChange={(value) =>
                    dispatch({ type: "SET_STAND_UUID", payload: value })
                  }
                />
              </div>
            </div>
          )}
          <div className={styles.header_main}>
            <Button onClick={() => setShowLast(true)}>
              <HistorySVG />
            </Button>
            <div
              className={styles.resumeCart}
              onClick={() => setShowCart(true)}
            >
              <ShoppingCartSVG />
              <p>{state.totalQuantity}</p>
              <p>R${state.rechargeValue}</p>
            </div>
          </div>
        </div>
      </div>
      <ul className={styles.main}>
        {products.map((product, index) => {
          const quantity =
            state.items.find((item) => item.productUuid === product.uuid)
              ?.quantity ?? 0;
          return (
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
                  <img
                    src={product.productImg}
                    className={styles.productImage}
                  />
                ) : (
                  <ImageSVG />
                )}
              </div>
              <p>{product.productName}</p>
              <p>R${(product.price - product.discount).toFixed(2)}</p>
              <p>
                Estoque:{" "}
                {product.stock !== null ? product.stock - quantity : "∞"}
              </p>
              <Button
                className={`${styles.modifierProduct} ${product.stock === 0 && styles.itemNull}`}
                onClick={() =>
                  dispatch({ type: "ADD_ITEM", payload: { ...product } })
                }
              >
                <PlusSVG />
              </Button>
            </li>
          );
        })}
      </ul>
      <PageSelect value={page.number} max={page.max} dispatch={pageDispatch} />
      {showCart && (
        <FormTrade
          reducer={[state, dispatch]}
          hide={handleShowTrade}
          type="normal"
          isAdmin={modeAdmin}
        />
      )}
      {showLast && (
        <LastTradeList
          setShow={() => {
            handleShowLastTrade();
          }}
        />
      )}
    </div>
  );
}

export default StandFunctionSimple;
