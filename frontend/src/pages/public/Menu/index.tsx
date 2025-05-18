import styles from "./Menu.module.scss";
import { useEffect, useReducer, useState } from "react";
import StandOptionsFilter from "@/components/selects/StandSelect";
import SearchFilter from "./SearchFilter";
import { SummaryProduct } from "@data/stands/Product";
import useProductService from "@service/stand/useProductService";
import PublicDropDrown from "./PublicDropDrown";
import { ImageSVG, ShoppingCartSVG } from "@/assets/svg";
import {
  initialTradeState,
  tradeReducer,
} from "@reducer/operation/tradeReducer";
import FormTrade from "@/pages/workspace/StandFunctionTrade/FormTrade";
import SingleTagSelect from "@/components/selects/TagSelect/SingleTagSelect";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import calculateLayout from "@/utils/calcAmountItemOnScreen";
import PageSelect from "@/components/selects/PageSelect";
import ItemDetails from "./ItemDetails";
import Button from "@/components/utils/Button";

type ViewType = "List" | "Items";

function Menu() {
  const [toggleView, setToggleView] = useState<ViewType>("Items");
  const [state, dispatch] = useReducer(tradeReducer, initialTradeState);
  const [page, pageDispatch] = useReducer(pageReducer, initialPageState);
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [showCart, setShowCart] = useState<boolean>(false);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string | undefined>();
  const [filter, setFilter] = useState<string>("");
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const { getProducts } = useProductService();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProducts(
        state.standUuid,
        filter.toLowerCase(),
        selectedTag,
        page.number,
        calculateLayout(window.innerWidth, window.innerHeight),
        "productName,asc",
      );
      if (response) {
        pageDispatch({
          type: "SET_PAGE_MAX",
          payload: response.page.totalPages,
        });
        setProducts(response.content);
      }
    };
    fetchProducts();
  }, [page.number, filter, state.standUuid, selectedTag, getProducts]);

  const handleToggleView = (value: ViewType) => {
    setToggleView(value);
  };

  const handlerSelectStand = (value: string | undefined) => {
    dispatch({ type: "SET_STAND_UUID", payload: value });
    pageDispatch({ type: "SET_PAGE_NUMBER", payload: 0 });
  };

  const handleShowSearch = () => {
    setShowSearch((value) => {
      if (value) {
        setFilter("");
        pageDispatch({ type: "SET_PAGE_NUMBER", payload: 0 });
        setSelectedTag(undefined);
      }
      return !value;
    });
  };

  const handleShowCart = () => {
    setShowCart((value) => !value);
  };

  const handleTag = (value: string | undefined) => {
    pageDispatch({ type: "SET_PAGE_NUMBER", payload: 0 });
    setSelectedTag(value);
  };

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    pageDispatch({ type: "SET_PAGE_NUMBER", payload: 0 });
    setFilter(event.target.value);
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
            <>
              <div className={styles.tagSelection}>
                <p>Tag:</p>
                <SingleTagSelect value={selectedTag} onChange={handleTag} />
              </div>
              <SearchFilter value={filter} onChange={handleFilter} />
            </>
          )}
          <StandOptionsFilter
            value={state.standUuid}
            onChange={(value) => handlerSelectStand(value)}
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
            <li key={product.uuid}>
              <div
                className={`${styles.cartQuantity} ${quantity === product.stock && styles.itemOver}`}
              >
                {quantity && <span>{quantity}</span>}
                {quantity === product.stock && <p>acabou '-'</p>}
              </div>
              <div
                className={`${styles.frame} ${product.stock === 0 && styles.frameEmpty}`}
                onClick={() => setSelectedItem(product.uuid)}
              >
                {product.productImg ? (
                  <img src={product.productImg} className={styles.imageFrame} />
                ) : (
                  <ImageSVG />
                )}
              </div>
              <div className={styles.itemFooter}>
                <div
                  className={styles.itemLabel}
                  onClick={() => setSelectedItem(product.uuid)}
                >
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
                <Button
                  className={styles.cartButton}
                  onClick={() =>
                    dispatch({ type: "ADD_ITEM", payload: { ...product } })
                  }
                >
                  <p>Adicionar ao carrinho</p>
                  <ShoppingCartSVG size={12} />
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
      <PageSelect
        className={styles.pageFooter}
        value={page.number}
        max={page.max}
        dispatch={pageDispatch}
      />
      {showCart && (
        <FormTrade
          reducer={[state, dispatch]}
          hide={handleShowCart}
          type="pre"
        />
      )}
      {selectedItem !== "" && (
        <ItemDetails uuid={selectedItem} hide={() => setSelectedItem("")} />
      )}
    </div>
  );
}

export default Menu;
