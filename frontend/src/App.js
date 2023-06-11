import React, { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import "./App.css";

import Home from "./pages/Home";
import Seller from "./pages/Seller";
import ConfirmPurchase from "./pages/ConfirmPurchase";
import Cashier from "./pages/Cashier";
import ConfirmRecharge from "./pages/ConfirmRecharge";
import Login from "./pages/Login";
import Signin from "./pages/Signin";
import Database from "./pages/Database";

const router = createBrowserRouter([
  { path: '/', element: <Home/>},
  { path: '/vendedor', element: <Seller/>},
  { path: '/confirmar-compra', element: <ConfirmPurchase/>},
  { path: '/caixa', element: <Cashier/>},
  { path: '/confirmar-recarga', element: <ConfirmRecharge/>},
  { path: '/login', element: <Login/>},
  { path: '/signin', element: <Signin/>},
  { path: '/database', element: <Database/>}
])

function App() {
  //const [Itens, setItens] = useState([]);
  // useEffect(() => {
  //   fetch("/api/")
  //     .then(res => res.json())
  //     .then(res => setMessage(res.message))
  //     .catch(console.error);
  // }, [setMessage]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
