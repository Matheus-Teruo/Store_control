import React, { useState, useEffect, useContext } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import AuthContext from '../store/auth_context';

function Navbar() {
  const [user, setUser] = useState({
    firstname: "",
    firstTime: true
  })
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth.user.authenticated === 2 && user.firstTime){
      setUser((user) => ({...user, firstTime: false}))
      return auth.onLogin()
    } else if (auth.user.authenticated === true && !user.firstTime){
      setUser((user) => ({...user, firstTime: true}))
    }
  }, [])

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
            {/* {auth.user.authenticated === true &&
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
                <NavLink to="/admin/inventario">
                  Inventário
                </NavLink>
              </li>
              </>
            } */}
          </ul>
          {auth.user.authenticated === true?
            <div>
              <NavLink to="/user">{auth.user.firstname}</NavLink>
            </div>
          : 
            <div>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Sign-up</NavLink>
            </div>
          }
        </nav>
      </header>
      <Outlet/>
    </>
  )
}

export default Navbar