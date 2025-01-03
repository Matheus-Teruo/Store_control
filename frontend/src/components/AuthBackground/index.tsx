import styles from "./AuthBackground.module.scss";
import { Outlet } from "react-router-dom";

function AuthBackground() {
  return (
    <div className={styles.background}>
      <div className={styles.body}>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthBackground;
