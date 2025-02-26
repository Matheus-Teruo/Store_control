import styles from "./Menu.module.scss";
import { useEffect, useReducer, useState } from "react";
import StandOptionsFilter from "@/components/selects/StandSelect";
import SearchFilter from "./SearchFilter";
import { SummaryProduct } from "@data/stands/Product";
import useProductService from "@service/stand/useProductService";
import {
  initialPurchaseState,
  purchaseReducer,
} from "@reducer/operation/purchaseReducer";
import PublicDropDrown from "./PublicDropDrown";
import { ImageSVG } from "@/assets/svg";

type ViewType = "List" | "Items";

function Menu() {
  const [toggleView, setToggleView] = useState<ViewType>("Items");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [_cart, _dispatch] = useReducer(purchaseReducer, initialPurchaseState);
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

  return (
    <div className={styles.background}>
      <div className={styles.headerBackground}>
        <div className={styles.header}>
          <PublicDropDrown
            menuView={toggleView}
            showSearch={showSearch}
            setTouggleView={handleToggleView}
            setShowSearch={handleShowSearch}
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
        {products.map((product) => (
          <li key={product.uuid}>
            <div
              className={`${styles.frame} ${product.stock === 0 && styles.frameEmpty}`}
            >
              {product.productImg ? (
                <img src={product.productImg} className={styles.imageFrame} />
              ) : (
                <ImageSVG className={styles.imageFrame} />
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
        ))}
      </ul>
    </div>
  );
}

export default Menu;
