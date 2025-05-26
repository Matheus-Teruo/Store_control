import styles from "./Menu.module.scss";
import { useEffect, useReducer, useRef, useState } from "react";
import StandOptionsFilter from "@/components/selects/StandSelect";
import SearchFilter from "./SearchFilter";
import { SummaryProduct } from "@data/stands/Product";
import useProductService from "@service/stand/useProductService";
import PublicDropDrown from "./PublicDropDrown";
import { ImageSVG } from "@/assets/svg";
import backgroundJunino from "@/assets/image/bandeiras_festa_junina.png";
import {
  initialTradeState,
  tradeReducer,
} from "@reducer/operation/tradeReducer";
import FormTrade from "@/pages/workspace/StandFunctionTrade/FormTrade";
import SingleTagSelect from "@/components/selects/TagSelect/SingleTagSelect";
import { initialPageState, pageReducer } from "@reducer/pageReducer";
import calculateLayout from "@/utils/calcAmountItemOnScreen";
import ItemDetails from "./ItemDetails";
// import Button from "@/components/utils/Button";

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
  const [productPages, setProductPages] = useState<number>(-1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
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
        setProductPages(page.number);
        setProducts((prev) => {
          const existingIds = new Set(prev.map((p) => p.uuid));
          const uniqueNewProducts = response.content.filter(
            (p) => !existingIds.has(p.uuid),
          );
          return [...prev, ...uniqueNewProducts];
        });
      }
    };
    if (page.number > productPages) {
      fetchProducts();
    }
  }, [
    page.number,
    filter,
    state.standUuid,
    selectedTag,
    productPages,
    getProducts,
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          pageDispatch({ type: "INCREMENT_PAGE" });
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      },
    );

    const current = sentinelRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, []);

  const handleToggleView = (value: ViewType) => {
    setToggleView(value);
  };

  const handlerSelectStand = (value: string | undefined) => {
    dispatch({ type: "SET_STAND_UUID", payload: value });
    pageDispatch({ type: "SET_PAGE_NUMBER", payload: 0 });
    setProductPages(-1);
    setProducts([]);
  };

  const handleShowSearch = () => {
    setShowSearch((value) => {
      if (value) {
        setFilter("");
        pageDispatch({ type: "SET_PAGE_NUMBER", payload: 0 });
        setProductPages(-1);
        setProducts([]);
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
    setProductPages(-1);
    setProducts([]);
    setSelectedTag(value);
  };

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    pageDispatch({ type: "SET_PAGE_NUMBER", payload: 0 });
    setProductPages(-1);
    setProducts([]);
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
              <SearchFilter value={filter} onChange={handleFilter} />
              <div className={styles.tagSelection}>
                <p>Tag:</p>
                <SingleTagSelect value={selectedTag} onChange={handleTag} />
              </div>
            </>
          )}
          <StandOptionsFilter
            className={styles.standSelect}
            value={state.standUuid}
            onChange={(value) => handlerSelectStand(value)}
            mode="radio"
          />
        </div>
      </div>
      <ul
        className={`${toggleView === "Items" ? styles.items : styles.list}`}
        style={{ backgroundImage: `url(${backgroundJunino})` }}
      >
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
                  // onClick={() => setSelectedItem(product.uuid)}
                >
                  <p
                    className={`${styles.name} ${product.stock === 0 && styles.empty}`}
                    onClick={() => setSelectedItem(product.uuid)}
                  >
                    {product.productName}
                  </p>
                  <p
                    className={styles.summary}
                    onClick={() => setSelectedItem(product.uuid)}
                  >
                    {product.summary}
                  </p>
                  <div
                    className={styles.priceing}
                    onClick={() =>
                      dispatch({ type: "ADD_ITEM", payload: { ...product } })
                    }
                  >
                    <p className={`${product.stock === 0 && styles.empty}`}>
                      R${(product.price - product.discount).toFixed(2)}
                    </p>
                    {product.discount !== 0 && (
                      <s>R${product.price.toFixed(2)}</s>
                    )}
                  </div>
                </div>
                {/* <Button
                  className={styles.cartButton}
                  onClick={() =>
                    dispatch({ type: "ADD_ITEM", payload: { ...product } })
                  }
                >
                  <p>Adicionar ao carrinho</p>
                  <ShoppingCartSVG size={12} />
                </Button> */}
              </div>
            </li>
          );
        })}
        <div
          ref={sentinelRef}
          style={{
            width: "100%",
            height: 1,
            marginBottom: "2px",
          }}
        />
      </ul>
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
