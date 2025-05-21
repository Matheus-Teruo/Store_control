import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";
import User from "./pages/authentication/User";
import Menu from "./pages/public/Menu";
import Order from "./pages/public/Order";
import Hub from "./pages/workspace/Hub";
import RegisterFunction from "./pages/workspace/RegisterFunction";
import StandFunction from "./pages/workspace/StandFunction";
import StandFunctionSimple from "./pages/workspace/StandFunctionTrade";
import Products from "./pages/workspace/Products";
import Associations from "./pages/admin/Associations";
import Cards from "./pages/admin/Cards";
import Stands from "./pages/admin/Stands";
import Tags from "./pages/admin/Tags";
import Volunteers from "./pages/admin/Volunteers";
import LogHeader from "./components/pagePieces/LogsHeader";
import TradesLogs from "./pages/analytics/logpages/TradeLogs";
import PurchaseLogs from "./pages/analytics/logpages/PurchaseLogs";
import TransactionLogs from "./pages/analytics/logpages/TransactionLogs";
import StatisticsHeader from "./components/pagePieces/StatisticsHeader";
import CustomerStatistics from "./pages/analytics/Statistics/CustomerStatistics";
import RechargeChart from "./pages/analytics/Statistics/RechargeChart";
import PurchaseChart from "./pages/analytics/Statistics/PurchaseChart";
import TotalProductsBars from "./pages/analytics/Statistics/TotalProductsBars";
import AuthPage from "./components/pagePieces/AuthBackground";
import NotificationManager from "./components/NotificationManager";
import AdminHeader from "./components/pagePieces/AdminHeader";
import Transaction from "./pages/workspace/TrasactionOperation";
import activeConfig from "./config/activeConfig";
import PublicHeader from "./components/pagePieces/PublicHeader";
import WorkspaceHeader from "./components/pagePieces/WorkspaceHeader";
import NotFound from "./pages/NotFound";
import Home from "./pages/public/Home";

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
        <Route path="/" element={<Home />} />
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
          <Route path="registers" element={<RegisterFunction />} />
          <Route path="sales" element={salesComponent} />
          <Route path="products" element={<Products />} />
          <Route path="transaction" element={<Transaction />} />
        </Route>
        <Route path="/analytics">
          <Route path="logs" element={<LogHeader />}>
            <Route path="trades" element={<TradesLogs />} />
            <Route path="purchases" element={<PurchaseLogs />} />
            <Route path="transactions" element={<TransactionLogs />} />
          </Route>
          <Route path="statistics" element={<StatisticsHeader />}>
            <Route path="customer" element={<CustomerStatistics />} />
            <Route path="recharge" element={<RechargeChart />} />
            <Route path="purchase" element={<PurchaseChart />} />
            <Route path="product" element={<TotalProductsBars />} />
          </Route>
        </Route>
        <Route path="/admin/tags" element={<Tags />} />
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
