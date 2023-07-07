import "./App.css"
import React from "react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Navbar from "./pages/Navbar";
import Home from "./pages/Home";

import Seller from "./pages/main/Seller";
import Cashier from "./pages/main/Cashier";
import Stocktaking from "./pages/main/Stocktaking";

import User from "./pages/auth/User";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import Admin from "./pages/admin/Admin";
import Database from "./pages/admin/Database";
import Cards from "./pages/admin/Cards";
import AllUsers from "./pages/admin/AllUsers";

import { AuthContextProvider } from "./store/auth_context";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navbar/>,
    children: [
      { path: '/', element: <Home/>},
      { path: '/seller', element: <Seller/>},
      { path: '/cashier', element: <Cashier/>},
      { path: '/user', element: <User/>},
      { path: '/login', element: <Login/>},
      { path: '/signup', element: <Signup/>},
      { path: '/stocktaking', element: <Stocktaking/>},
      { path: '/admin/',
        element: <Admin/>,
        children: [
          { path: 'allusers', element: <AllUsers/>},
          { path: 'cards', element: <Cards/>},
          { path: 'database', element: <Database/>},
        ],
      }
    ],
  },
])

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
