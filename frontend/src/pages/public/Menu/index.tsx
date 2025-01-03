import styles from "./Menu.module.scss";
import { useEffect, useState } from "react";
import OptionsFilter from "./OptionsFilter";
import SearchFilter from "./SearchFilter";
import { SummaryProducts } from "@data/stands/Product";
import Button from "@/components/utils/Button";

const productsExample: SummaryProducts[] = [
  {
    uuid: "b3f6f851-66ad-4e8e-9c47-65def747b72f",
    productName: "produto 1",
    price: 10.0,
    discount: 0.5,
    stock: 1000,
    productImg: null,
    standUuid: "55d399ed-a527-4f81-bcd6-8964b6100094",
  },
  {
    uuid: "670cf9ae-9b64-4eb1-845d-2fb3c04c24cf",
    productName: "produto 2",
    price: 20.0,
    discount: 1.5,
    stock: 450,
    productImg: null,
    standUuid: "55d399ed-a527-4f81-bcd6-8964b6100094",
  },
];

type ViewType = "List" | "Items";

function Menu() {
  const [selectedStands, setSelectedStands] = useState<string | undefined>(
    undefined,
  );
  const [filter, setFilter] = useState<string>("");
  const [products, setProducts] = useState<SummaryProducts[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<SummaryProducts[]>(
    [],
  );
  const [toggleView, setToggleView] = useState<ViewType>("Items");

  useEffect(() => {
    // Simula valores do backend
    setTimeout(() => {
      setProducts(productsExample);
    }, 1000);
  }, []);

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
