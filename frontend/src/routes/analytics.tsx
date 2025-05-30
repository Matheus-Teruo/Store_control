import LogHeader from "@/components/pagePieces/LogsHeader";
import StatisticsHeader from "@/components/pagePieces/StatisticsHeader";
import PurchaseLogs from "@/pages/analytics/logpages/PurchaseLogs";
import TradeLogs from "@/pages/analytics/logpages/TradeLogs";
import TransactionLogs from "@/pages/analytics/logpages/TransactionLogs";
import CustomerStatistics from "@/pages/analytics/Statistics/CustomerStatistics";
import PurchaseChart from "@/pages/analytics/Statistics/PurchaseChart";
import RechargeChart from "@/pages/analytics/Statistics/RechargeChart";
import TotalProductsBars from "@/pages/analytics/Statistics/TotalProductsBars";
import { Route, Routes } from "react-router-dom";

function AnalysticsRoutesComponent() {
  return (
    <Routes>
      <Route path="">
        <Route path="logs" element={<LogHeader />}>
          <Route path="trades" element={<TradeLogs />} />
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
    </Routes>
  );
}

export default AnalysticsRoutesComponent;
