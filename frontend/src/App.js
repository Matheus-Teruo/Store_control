import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import "./App.css";

import Root from "./pages/Root";
import Home from "./pages/Home";
import Seller from "./pages/Seller";
import ConfirmPurchase from "./pages/ConfirmPurchase";
import Cashier from "./pages/Cashier";
import ConfirmRecharge from "./pages/ConfirmRecharge";
import Inventory from "./pages/Inventory";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Database from "./pages/Database";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root/>,
    children: [
      { path: '/', element: <Home/>},
      { path: '/vendedor', element: <Seller/>},
      { path: '/vendedor/confirmar-compra', element: <ConfirmPurchase/>},
      { path: '/caixa', element: <Cashier/>},
      { path: '/caixa/confirmar-recarga', element: <ConfirmRecharge/>},
      { path: '/inventario', element: <Inventory/>},
      { path: '/login', element: <Login/>},
      { path: '/signup', element: <Signup/>},
      { path: '/database', element: <Database/>}
    ],
  },
])

function App() {
  return <RouterProvider router={router} />;
}

export default App;
