import styles from "./ComponentWrapper.module.scss";
import { ReactNode } from "react";

function ComponentWrapper({ children }: { children: ReactNode }) {
  return <div className={styles.mainWrapper}>{children}</div>;
}

export default ComponentWrapper;
