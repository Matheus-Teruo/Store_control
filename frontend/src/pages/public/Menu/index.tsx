import styles from "./Menu.module.scss";
import { useEffect, useState } from "react";
import OptionsFilter from "./OptionsFilter";
import SearchFilter from "./SearchFilter";
import { SummaryProduct } from "@data/stands/Product";
import Button from "@/components/utils/Button";
import { useHandleApiError } from "@/axios/handlerApiError";
import { getProducts } from "@service/stands/productService";

type ViewType = "List" | "Items";

function Menu() {
  const [selectedStands, setSelectedStands] = useState<string | undefined>(
    undefined,
  );
  const [filter, setFilter] = useState<string>("");
  const [products, setProducts] = useState<SummaryProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<SummaryProduct[]>(
    [],
  );
  const [toggleView, setToggleView] = useState<ViewType>("Items");
  const handleApiError = useHandleApiError();

  useEffect(() => {
    const fetchStand = async () => {
      try {
        const products = await getProducts();
        setProducts(products);
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchStand();
  }, [handleApiError]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const isInStock = selectedStands
        ? product.standUuid === selectedStands
        : true;
      const matchesFilter = product.productName
        .toLowerCase()
        .includes(filter.toLowerCase());
      return isInStock && matchesFilter;
    });
    setFilteredProducts(filtered);
  }, [filter, selectedStands, products]);

  const handleFilterStand = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStands(event.target.value);
  };

  const handleFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

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
          <OptionsFilter value={selectedStands} onChange={handleFilterStand} />
          <SearchFilter value={filter} onChange={handleFilter} />
        </div>
      </div>
      <div className={styles.main}>
        <div className={styles.setting}>
          <Button onClick={handleToggleView}>Alternar</Button>
        </div>
        <ul>
          {filteredProducts.map((product) => (
            <li key={product.uuid}>
              <div className={styles.frame}>
                {
                  product.productImg !== null ? (
                    <img src={product.productImg} />
                  ) : (
                    <></>
                  )
                  // futuramente usar SVG padrão
                }
              </div>
              <div className={styles.tag}>
                <p>{product.productName}</p>
                <div className={styles.priceing}>
                  <p>R${(product.price - product.discount).toFixed(2)}</p>
                  <p>
                    <s>R${product.price.toFixed(2)}</s>
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
