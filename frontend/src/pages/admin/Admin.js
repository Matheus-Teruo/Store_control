import './Admin.css'
import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';

function Admin() {
  const { pathname } = useLocation();

  return (
    <>
      <nav className="NavAdmin">
        <ul className="MenuAdmin">
          <li className={`NavElements ${pathname === '/admin/allusers' && "selected"}`}>
            <NavLink to="/admin/allusers">
              Usuarios
            </NavLink>
          </li>
          <li className={`NavElements ${pathname === '/admin/cards' && "selected"}`}>
            <NavLink to="/admin/cards">
              Cartões
            </NavLink>
          </li>
          <li className={`NavElements ${pathname === '/admin/database' && "selected"}`}>
            <NavLink to="/admin/database">
              Associações
            </NavLink>
          </li>
        </ul>
      </nav>
      <Outlet/>
    </>
  )
}

export default Admin