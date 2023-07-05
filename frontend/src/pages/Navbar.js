import "./Navbar.css"
import React, { useState, useEffect, useContext } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'react-feather';
import AuthContext from '../store/auth_context';

function Navbar() {
  const [user, setUser] = useState({
    firstname: "",
    firstTime: true
  })
  const auth = useContext(AuthContext);
  const { pathname } = useLocation();

  useEffect(() => {  // Page requirements
    if (auth.user.authenticated === 2 && user.firstTime){
      setUser((user) => ({...user, firstTime: false}))
      return auth.onLogin()
    } else if (auth.user.authenticated === true && !user.firstTime){
      setUser((user) => ({...user, firstTime: true}))
    }
  }, [auth, user])

  return (
    <>
      <header className={auth.user.authenticated === true ? "HeaderOnline" : "HeaderOffline"}>
        <nav className="navHeader">
          <div className="navMenu">
            {pathname !== '/' &&
            <NavLink className="navLinks" to="/">
              <ChevronLeft/>
            </NavLink>
            }
          </div>
          <div className="navTitle">
            {pathname === '/user' &&
              <h2>Usuário</h2>
            }
            {pathname === '/seller' &&
              <h2>Vendedor</h2>
            }
            {pathname === '/cashier' &&
              <h2>Caixa</h2>
            }
            {pathname === '/stocktaking' &&
              <h2>Inventário</h2>
            }
          </div>
          <div className="navUser">
            {auth.user.authenticated === true &&
            <NavLink className="navLinks" to="/user">
              {auth.user.firstname}
            </NavLink> 
            }
          </div>
        </nav>
      </header>
      <Outlet/>
    </>
  )
}

export default Navbar