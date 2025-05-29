import WorkspaceHeader from "@/components/pagePieces/WorkspaceHeader";
import activeConfig from "@/config/activeConfig";
import Hub from "@/pages/workspace/Hub";
import Products from "@/pages/workspace/Products";
import RegisterFunction from "@/pages/workspace/RegisterFunction";
import StandFunction from "@/pages/workspace/StandFunction";
import StandFunctionSimple from "@/pages/workspace/StandFunctionTrade";
import Transaction from "@/pages/workspace/TrasactionOperation";
import { Route, Routes } from "react-router-dom";

function WorkspaceRoutesComponent() {
  let salesComponent;
  if (activeConfig.version === "simple") {
    salesComponent = <StandFunctionSimple />;
  } else {
    salesComponent = <StandFunction />;
  }

  return (
    <Routes>
      <Route path="" element={<WorkspaceHeader />}>
        <Route path="" element={<Hub />} />
        <Route path="registers" element={<RegisterFunction />} />
        <Route path="sales" element={salesComponent} />
        <Route path="products" element={<Products />} />
        <Route path="transaction" element={<Transaction />} />
      </Route>
    </Routes>
  );
}

export default WorkspaceRoutesComponent;
