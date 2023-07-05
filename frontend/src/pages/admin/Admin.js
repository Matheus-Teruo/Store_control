import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

function Admin() {
  return (
    <>
      <nav>
        <div>
          <ul>
            <li>
              <NavLink to="/admin/allusers">
                Usuarios
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/cards">
                Cartões
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/database">
                Associações
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet/>
    </>
  )
}

export default Admin