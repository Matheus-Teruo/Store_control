import styles from "./Menu.module.scss";
import { useEffect, useState } from "react";
import StandOptionsFilter from "@/components/StandSelect";
import SearchFilter from "./SearchFilter";
import { SummaryProduct } from "@data/stands/Product";
import Button from "@/components/utils/Button";
import useProductService from "@service/stand/useProductService";

type ViewType = "List" | "Items";

function Menu() {
  const [selectedStands, setSelectedStands] = useState<string | undefined>(
    undefined,
  );
  const [filter, setFilter] = useState<string>("");
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const [toggleView, setToggleView] = useState<ViewType>("Items");
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

  const handleToggleView = () => {
    if (toggleView === "List") {
      setToggleView("Items");
    } else {
      setToggleView("List");
    }
  };

  return (
    <div className={styles.background}>
      <div className={styles.headerBackground}>
        <div className={styles.header}>
          <StandOptionsFilter
            value={selectedStands}
            onChange={(event) => setSelectedStands(event.target.value)}
          />
          <SearchFilter
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.setting}>
          <Button onClick={handleToggleView}>Alternar</Button>
        </div>
        <ul>
          {products.map((product) => (
            <li key={product.uuid}>
              <div className={styles.frame}>
                {
                  product.productImg ? <img src={product.productImg} /> : <></>
                  // futuramente usar SVG padrão
                }
              </div>
              <div className={styles.tag}>
                <p>{product.productName}</p>
                <div className={styles.priceing}>
                  <p>R${(product.price - product.discount).toFixed(2)}</p>
                  <p>
                    {product.discount !== 0 && (
                      <s>R${product.price.toFixed(2)}</s>
                    )}
                  </p>
                </div>
                <p>Estoque: {product.stock}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Menu;
