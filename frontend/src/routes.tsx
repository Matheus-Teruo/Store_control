import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";
import User from "./pages/authentication/User";
import Home from "./pages/public/Home";
import Menu from "./pages/public/Menu";
import Order from "./pages/public/Order";
import Hub from "./pages/workspace/Hub";
import CashierFunction from "./pages/workspace/CashierFunction";
import StandFunction from "./pages/workspace/StandFunction";
import Products from "./pages/workspace/Products";
import Associations from "./pages/admin/Associations";
import Cards from "./pages/admin/Cards";
import Stands from "./pages/admin/Stands";
import Volunteers from "./pages/admin/Volunteers";
import Purchases from "./pages/analytics/Purchases";
import Statistics from "./pages/analytics/Statistics";
import AuthPage from "./components/AuthBackground";
import NotificationManager from "./components/NotificationManager";
import AdminHeader from "./components/AdminHeader";
import Transactions from "./pages/admin/Transactions";

function AppRouter() {
  return (
    <Router>
      <NotificationManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/order/:cardID" element={<Order />} />
        <Route path="/auth" element={<AuthPage />}>
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="user" element={<User />} />
        </Route>
        <Route path="/workspace">
          <Route path="" element={<Hub />} />
          <Route path="cashiers" element={<CashierFunction />} />
          <Route path="sales" element={<StandFunction />} />
          <Route path="products" element={<Products />} />
        </Route>
        <Route path="/analytics">
          <Route path="purchases" element={<Purchases />} />
          <Route path="statistics" element={<Statistics />} />
        </Route>
        <Route path="/admin" element={<AdminHeader />}>
          <Route path="associations" element={<Associations />} />
          <Route path="cards" element={<Cards />} />
          <Route path="stands" element={<Stands />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="volunteers" element={<Volunteers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRouter;
