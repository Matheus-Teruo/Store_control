import styles from "./WorkspaceHeader.module.scss";
import { Outlet, Link, useLocation } from "react-router-dom";
import Logo from "@/assets/image/LogoStoreControl.png";
import HubDropDown from "./HubDropDown";

const PagesData: Record<string, { label: string }> = {
  ["/workspace"]: { label: "Workspace" },
  ["/workspace/cashier"]: { label: "Caixa" },
  ["/workspace/sales"]: { label: "Estande" },
  ["/workspace/products"]: { label: "Produtos" },
  ["/workspace/transaction"]: { label: "Transação de Caixa" },
};

function WorkspaceHeader() {
  const location = useLocation();
  console.log(location.pathname);

  return (
    <div>
      <div className={styles.background}>
        <div className={styles.header}>
          {location.pathname !== "/workspace" ? (
            <Link to="/workspace" className={styles.linkLogo}>
              <img
                src={Logo}
                alt="Logo: imagem circular com um rosto de raposa no meio"
              />
            </Link>
          ) : (
            <div className={styles.spaceHolder} />
          )}
          <h3>{PagesData[location.pathname].label}</h3>
          {location.pathname === "/workspace" ? (
            <HubDropDown />
          ) : (
            <div className={styles.spaceHolder} />
          )}
        </div>
      </div>
      <Outlet />
    </div>
  );
}

export default WorkspaceHeader;
