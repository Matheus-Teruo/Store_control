import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/authentication/Login";
import Signup from "./pages/authentication/Signup";
import User from "./pages/authentication/User";
import Menu from "./pages/public/Menu";
import Card from "./pages/public/Card";
import AuthPage from "./components/pagePieces/AuthBackground";
import NotificationManager from "./components/NotificationManager";
import PublicHeader from "./components/pagePieces/PublicHeader";
import NotFound from "./pages/NotFound";
import Home from "./pages/public/Home";
import { Suspense, lazy } from "react";
import LoadingPage from "./pages/LoadingPage";

const LazyWorkspaceRoutes = lazy(() => import("./routes/workspace"));
const LazyAnalyticsRoutes = lazy(() => import("./routes/analytics"));
const LazyAdminRoutes = lazy(() => import("./routes/admin"));

function AppRouter() {
  return (
    <Router>
      <NotificationManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/" element={<PublicHeader />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/card/:cardID" element={<Card />} />
        </Route>
        <Route path="/auth" element={<AuthPage />}>
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
          <Route path="user" element={<User />} />
        </Route>
        <Route
          path="/workspace/*"
          element={
            <Suspense fallback={<LoadingPage />}>
              <LazyWorkspaceRoutes />
            </Suspense>
          }
        />
        <Route
          path="/analytics/*"
          element={
            <Suspense fallback={<LoadingPage />}>
              <LazyAnalyticsRoutes />
            </Suspense>
          }
        />
        <Route
          path="/admin/*"
          element={
            <Suspense fallback={<LoadingPage />}>
              <LazyAdminRoutes />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
