import React, { useEffect, useContext } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import AuthContext from '../store/auth_context';

function Navbar() {
  const auth = useContext(AuthContext);

  useEffect(() => {
    return auth.onLogin()
  }, [auth])

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
            {auth.user.authenticated &&
              <>
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
              </>
            }
          </ul>
          {auth.user.authenticated ?
            <div>
              <NavLink to="/user">{auth.user.firstname}</NavLink>
            </div>
            :
            <div>
              <NavLink to="/login"/>
              <NavLink to="/signup"/>
            </div>
          }
        </nav>
      </header>
      <Outlet/>
    </>
  )
}

export default Navbar