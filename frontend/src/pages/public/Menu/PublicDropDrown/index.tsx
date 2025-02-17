import { useState } from "react";
import styles from "./PublicDropDown.module.scss";
import activeConfig from "@/config/activeConfig";
import Button from "@/components/utils/Button";

type ViewType = "List" | "Items";

interface PublicDropDrownProps {
  menuView: ViewType;
  showSearch: boolean;
  setTouggleView: (event: ViewType) => void;
  setShowSearch: () => void;
}

function PublicDropDrown({
  menuView,
  showSearch,
  setTouggleView,
  setShowSearch,
}: PublicDropDrownProps) {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div className={styles.tougle}>
      <Button onClick={() => setShow((value) => !value)}>MENU</Button>
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
                  ITEMS
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
                  LISTA
                </span>
              </label>
            </li>
            <li onClick={setShowSearch}>
              <p>{showSearch ? "Esconder" : "Pesquisar"}</p>
            </li>
            {activeConfig.version !== "tokens" && (
              <li>
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
