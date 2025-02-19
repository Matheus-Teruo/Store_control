import { MenuSVG, UserSVG } from "@/assets/svg";
import styles from "./HubDropDown.module.scss";
import { useState } from "react";
import Button from "@/components/utils/Button";
import { Link } from "react-router-dom";

function HubDropDown() {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div className={styles.tougle}>
      <Button onClick={() => setShow((value) => !value)}>
        <MenuSVG className={`${styles.menuSVG} ${show && styles.active}`} />
      </Button>
      {show && (
        <>
          <ul>
            <li>
              <Link to="/auth/user" className={styles.link}>
                <UserSVG />
                <p>Perfil</p>
              </Link>
            </li>
            {/* <li><GlobeSVG /><p>Language</p></li> */}
          </ul>
          <div className={styles.background} onClick={() => setShow(false)} />
        </>
      )}
    </div>
  );
}

export default HubDropDown;
