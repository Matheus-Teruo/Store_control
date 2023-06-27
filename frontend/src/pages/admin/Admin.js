import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

function Admin() {
  return (
    <>
      <header>
        <div>
          <ul>
            <li>
              <NavLink to="/admin/cards">
                Cartões
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/database">
                Database
              </NavLink>
            </li>
          </ul>
        </div>
      </header>
      <Outlet/>
    </>
  )
}

export default Admin