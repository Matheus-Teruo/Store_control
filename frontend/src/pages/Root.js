import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home } from 'react-feather';

function Root() {
  return (
    <>
      <header>
        <nav>
          <ul>
            <li>
              <NavLink to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/vendedor">
                Vendedor
              </NavLink>
            </li>
            <li>
              <NavLink to="/caixa">
                Caixa
              </NavLink>
            </li>
            <li>
              <NavLink to="/inventario">
                Inventário
              </NavLink>
            </li>
          </ul>
          <div>Welcome, John Doe!</div> {/* Replace "John Doe" with the username */}
        </nav>
      </header>
      <Outlet/>
    </>
  )
}

export default Root