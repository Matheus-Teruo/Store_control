import React, { useState, useContext } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import AuthContext from '../store/auth_context';

function Root() {
  const [showUser, setShowUser] = useState(false);
  const [logoutDoble, setLogoutDoble] = useState(false);
  const auth = useContext(AuthContext);

  const handleClick = () => {
    setShowUser(showUser => !showUser)
  };
  const handleDobleCheck = (value) => {
    setLogoutDoble(value)
  };
  const handleLogout = () => {
    setLogoutDoble(false)
    auth.onLogout()
  };

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
              <p onClick={handleClick}>{auth.user.firstname}</p>
              {showUser && 
                <div>
                  <p>a</p>
                  {!logoutDoble ?
                    <buttom onClick={() => handleDobleCheck(true)}>Logout</buttom>
                  :
                    <div>
                      <buttom onClick={() => handleLogout()}> Sim </buttom>
                      <buttom onClick={() => handleDobleCheck(false)}> Não </buttom>
                    </div>
                  }
                </div>
              }
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

export default Root