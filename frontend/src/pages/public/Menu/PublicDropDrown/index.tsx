import { useState } from "react";
import styles from "./PublicDropDown.module.scss";
import activeConfig from "@/config/activeConfig";
import Button from "@/components/utils/Button";
import {
  MenuSVG,
  ListSVG,
  GridSVG,
  SearchSVG,
  ShoppingCartSVG,
} from "@/assets/svg";

type ViewType = "List" | "Items";

interface PublicDropDrownProps {
  menuView: ViewType;
  showSearch: boolean;
  cartSize?: number;
  setTouggleView: (event: ViewType) => void;
  setShowSearch: () => void;
  setShowCart?: () => void;
}

function PublicDropDrown({
  menuView,
  showSearch,
  cartSize = 0,
  setTouggleView,
  setShowSearch,
  setShowCart,
}: PublicDropDrownProps) {
  const [show, setShow] = useState<boolean>(false);

  const handleCart = () => {
    if (setShowCart) {
      setShowCart();
    }
    setShow(false);
  };

  return (
    <div className={styles.toggle}>
      <Button onClick={() => setShow((value) => !value)}>
        <MenuSVG className={`${styles.menuSVG} ${show && styles.active}`} />
      </Button>
      {cartSize !== 0 && !show && (
        <span className={styles.cartSizeIndicator}>{cartSize}</span>
      )}
      {show && (
        <>
          <ul>
            <li className={styles.view}>
              <label>
                <input
                  type="radio"
                  name="menuView"
                  value="Items"
                  checked={menuView === "Items"}
                  onChange={(e) => setTouggleView(e.target.value as ViewType)}
                />
                <span className={`${menuView === "Items" && styles.selected}`}>
                  <GridSVG />
                </span>
              </label>
              <div className={styles.divisor} />
              <label>
                <input
                  type="radio"
                  name="menuView"
                  value="List"
                  checked={menuView === "List"}
                  onChange={(e) => setTouggleView(e.target.value as ViewType)}
                />
                <span className={`${menuView === "List" && styles.selected}`}>
                  <ListSVG />
                </span>
              </label>
            </li>
            <li onClick={setShowSearch}>
              <SearchSVG size={16} className={styles.auxIcon} />
              <p>{showSearch ? "Esconder" : "Pesquisar"}</p>
            </li>
            {activeConfig.version !== "tokens" && (
              <li onClick={() => handleCart()}>
                <div className={styles.auxIcon}>
                  <ShoppingCartSVG size={16} />
                  <p>{cartSize}</p>
                </div>
                <p>Carrinho</p>
              </li>
            )}
            {/* <li>Language</li> */}
          </ul>
          <div className={styles.background} onClick={() => setShow(false)} />
        </>
      )}
    </div>
  );
}

export default PublicDropDrown;
