import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";
import User from "./pages/authentication/User";
import Menu from "./pages/public/Menu";
import Order from "./pages/public/Order";
import Hub from "./pages/workspace/Hub";
import CashierFunction from "./pages/workspace/CashierFunction";
import StandFunction from "./pages/workspace/StandFunction";
import StandFunctionSimple from "./pages/workspace/StandFunction/StandFunctionSimple";
import Products from "./pages/workspace/Products";
import Associations from "./pages/admin/Associations";
import Cards from "./pages/admin/Cards";
import Stands from "./pages/admin/Stands";
import Volunteers from "./pages/admin/Volunteers";
import Purchases from "./pages/analytics/Purchases";
import Statistics from "./pages/analytics/Statistics";
import AuthPage from "./components/pagePieces/AuthBackground";
import NotificationManager from "./components/NotificationManager";
import AdminHeader from "./components/pagePieces/AdminHeader";
import Transactions from "./pages/analytics/Statistics/Transactions";
import Transaction from "./pages/workspace/TrasactionOperation";
import activeConfig from "./config/activeConfig";
import PublicHeader from "./components/pagePieces/PublicHeader";
import WorkspaceHeader from "./components/pagePieces/WorkspaceHeader";
import Public from "./pages/public";
import NotFound from "./pages/NotFound";

function AppRouter() {
  let salesComponent;
  if (activeConfig.version === "simple") {
    salesComponent = <StandFunctionSimple />;
  } else {
    salesComponent = <StandFunction />;
  }

  return (
    <Router>
      <NotificationManager />
      <Routes>
        <Route path="/" element={<Public />} />
        <Route path="/about" element={<Public />} />
        <Route path="/" element={<PublicHeader />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/card/:cardID" element={<Order />} />
        </Route>
        <Route path="/auth" element={<AuthPage />}>
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="user" element={<User />} />
        </Route>
        <Route path="/workspace" element={<WorkspaceHeader />}>
          <Route path="" element={<Hub />} />
          <Route path="cashiers" element={<CashierFunction />} />
          <Route path="sales" element={salesComponent} />
          <Route path="products" element={<Products />} />
          <Route path="transaction" element={<Transaction />} />
        </Route>
        <Route path="/analytics">
          <Route path="purchases" element={<Purchases />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="transactions" element={<Transactions />} />
          {/* TODO: arrumar path depois */}
        </Route>
        <Route path="/admin" element={<AdminHeader />}>
          <Route path="associations" element={<Associations />} />
          <Route path="cards" element={<Cards />} />
          <Route path="stands" element={<Stands />} />
          <Route path="volunteers" element={<Volunteers />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
