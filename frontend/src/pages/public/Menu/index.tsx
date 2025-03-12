import styles from "./Menu.module.scss";
import { useEffect, useReducer, useState } from "react";
import StandOptionsFilter from "@/components/selects/StandSelect";
import SearchFilter from "./SearchFilter";
import { SummaryProduct } from "@data/stands/Product";
import useProductService from "@service/stand/useProductService";
import PublicDropDrown from "./PublicDropDrown";
import { ImageSVG } from "@/assets/svg";
import {
  initialTradeState,
  tradeReducer,
} from "@reducer/operation/tradeReducer";
import FormTrade from "@/pages/workspace/StandFunction/StandFunctionSimple/FormTrade";

type ViewType = "List" | "Items";

function Menu() {
  const [toggleView, setToggleView] = useState<ViewType>("Items");
  const [state, dispatch] = useReducer(tradeReducer, initialTradeState);
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [selectedStands, setSelectedStands] = useState<string | undefined>(
    undefined,
  );
  const [filter, setFilter] = useState<string>("");
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const { getProducts } = useProductService();

  useEffect(() => {
    const fetchStand = async () => {
      const response = await getProducts(filter.toLowerCase(), selectedStands);
      if (response) {
        setProducts(response.content);
      }
    };
    fetchStand();
  }, [filter, selectedStands, getProducts]);

  const handleToggleView = (value: ViewType) => {
    setToggleView(value);
  };

  const handleShowSearch = () => {
    setShowSearch((value) => {
      if (value) setFilter("");
      return !value;
    });
  };

  const handleShowCart = () => {
    setShowCart((value) => !value);
  };

  return (
    <div className={styles.background}>
      <div className={styles.headerBackground}>
        <div className={styles.header}>
          <PublicDropDrown
            menuView={toggleView}
            showSearch={showSearch}
            cartSize={state.totalQuantity}
            setTouggleView={handleToggleView}
            setShowSearch={handleShowSearch}
            setShowCart={handleShowCart}
          />
          {showSearch && (
            <SearchFilter
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
            />
          )}
          <StandOptionsFilter
            value={selectedStands}
            onChange={(value) => setSelectedStands(value)}
            mode="radio"
          />
        </div>
      </div>
      <ul className={`${toggleView === "Items" ? styles.items : styles.list}`}>
        {products.map((product) => {
          const quantity =
            state.items.find((item) => item.productUuid === product.uuid)
              ?.quantity ?? null;
          return (
            <li
              key={product.uuid}
              onClick={() =>
                dispatch({ type: "ADD_ITEM", payload: { ...product } })
              }
            >
              <div
                className={`${styles.cartQuantity} ${quantity === product.stock && styles.itemOver}`}
              >
                {quantity && <span>{quantity}</span>}
                {quantity === product.stock && <p>acabou '-'</p>}
              </div>
              <div
                className={`${styles.frame} ${product.stock === 0 && styles.frameEmpty}`}
              >
                {product.productImg ? (
                  <img src={product.productImg} className={styles.imageFrame} />
                ) : (
                  <ImageSVG />
                )}
              </div>
              <div className={styles.tag}>
                <p
                  className={`${styles.name} ${product.stock === 0 && styles.empty}`}
                >
                  {product.productName}
                </p>
                <p className={styles.summary}>{product.summary}</p>
                <div className={styles.priceing}>
                  <p className={`${product.stock === 0 && styles.empty}`}>
                    R${(product.price - product.discount).toFixed(2)}
                  </p>
                  <p>
                    {product.discount !== 0 && (
                      <s>R${product.price.toFixed(2)}</s>
                    )}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <FormTrade
        reducer={[state, dispatch]}
        showCart={showCart}
        setShowCart={setShowCart}
        type="pre"
      />
    </div>
  );
}

export default Menu;
