import WorkspaceHeader from "@/components/pagePieces/WorkspaceHeader";
import activeConfig from "@/config/activeConfig";
import Hub from "@/pages/workspace/Hub";
import PickUpCounter from "@/pages/workspace/PickUpCounter";
import Products from "@/pages/workspace/Products";
import RegisterFunction from "@/pages/workspace/RegisterFunction";
import StandFunction from "@/pages/workspace/StandFunction";
import StandFunctionTrade from "@/pages/workspace/StandFunctionTrade";
import Transaction from "@/pages/workspace/TrasactionOperation";
import { Route, Routes } from "react-router-dom";

function WorkspaceRoutesComponent() {
  let registerComponent;
  if (activeConfig.enableOrder) {
    registerComponent = <StandFunctionTrade />;
  } else {
    registerComponent = <RegisterFunction />;
  }

  let salesComponent;
  if (activeConfig.enableToken) {
    salesComponent = <StandFunction />;
  } else if (activeConfig.enableOrder) {
    salesComponent = <PickUpCounter />;
  } else {
    salesComponent = <StandFunctionTrade />;
  }

  return (
    <Routes>
      <Route path="" element={<WorkspaceHeader />}>
        <Route path="" element={<Hub />} />
        <Route path="registers" element={registerComponent} />
        <Route path="sales" element={salesComponent} />
        <Route path="products" element={<Products />} />
        <Route path="transaction" element={<Transaction />} />
      </Route>
    </Routes>
  );
}

export default WorkspaceRoutesComponent;
