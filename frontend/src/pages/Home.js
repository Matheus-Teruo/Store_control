import './Home.css';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Clipboard, DollarSign, Package, Users, CreditCard, Flag } from 'react-feather';
import Chart from '../midia/Chart.js';
import AuthContext from '../store/auth_context';
import Logo from '../midia/LogoStoreControl.png';

function Home() {
  const [user, setUser] = useState({
    standID: 0,
    superuser: false,
  })
  const auth = useContext(AuthContext);

  useEffect(() => {  // Page requirements
    if (auth.user.authenticated === true && user.standID === 0) {
      var resStatus;
      fetch("/api/main")
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            return setUser(data)
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch(console.error)
    }
  }, [auth, user.standID])

  return (
    <>
    {auth.user.authenticated === true ?
      <div className="Home_Logged">
        <h1 className="Title">
          Store Control
        </h1>
        <img src={Logo} alt="Logo"/>
        <div className="Main">
          <div className="Subtitle">
            <h2>Funções</h2>
          </div>
          {!(user.standID === 2 && user.superuser !== 1) &&
          <div className="Section">
            {user.standID > 2 ?
            <Link className="Frame1" to="/seller">
              <Clipboard alt="Vendedor"/>
              <p>Vendedor</p>
            </Link>
            : (user.standID !== 2 || user.superuser === 1) &&
            <div className="Frame1 invalid">
              <Clipboard alt="Vendedor"/>
              <p>Vendedor</p>
            </div>
            }
            {(user.superuser === 1 || user.standID === 1) ?
            <Link className="Frame1" to="/cashier">
              <DollarSign alt="Caixa"/>
              <p>Caixa</p>
            </Link>
            : user.standID !== 2 &&
            <div className="Frame1 invalid">
              <DollarSign alt="Caixa"/>
              <p>Caixa</p>
            </div>
            }
          </div>
          }
          {(user.superuser === 1 || user.standID === 2 ) &&
          <Link className="Frame2" to="/cashierdirect">
            <div className="IconDouble">
              <DollarSign alt="Caixa"/>
              <Clipboard alt="Vendedor"/>
            </div>
            <p>Caixa Direto</p>
          </Link>  
          }
          {(user.standID !== null && user.standID > 1) || user.superuser === 1 ? 
          <Link className="Frame2" to="/stocktaking">
            <Package alt="Stock"/>
            <p>Inventário</p>
          </Link>
          :
          <div className="Frame2 invalid">
            <Package alt="Stock"/>
            <p>Inventário</p>
          </div>
          }
          {user.superuser === 1 &&
          <>
          <div className="Subtitle">
            <h2>Administrador</h2>
          </div>
          <div className="Admin">
            <Link className="Frame3" to="/statistics">
              <Chart alt="Statistics"/>
              <p>Estatística</p>
            </Link>
          </div>
          <div className="Admin">
            <Link className="Frame4" to="/admin/allusers">
              <Users alt="Users"/>
              <p>Usuários</p>
            </Link>  
            <Link className="Frame4" to="/admin/cards">
              <CreditCard alt="Cards"/>
              <p>Cartões</p>
            </Link>
            <Link className="Frame4" to="/admin/database">
              <Flag alt="Database"/>
              <p>Associações</p>
            </Link>
          </div>
          </>
          }
        </div>
      </div>
    :
      <div className="Home_Unlogged">
        <h1 className="Title">
          Store Control
        </h1>
        <img src={Logo} alt="Logo"/>
        <div className="User">
          <Link className="Auth" to="/login">Entre</Link>
          <p className="Text">ou</p>
          <Link className="Auth" to="/signup">Cadastre-se</Link>
        </div>
      </div>
    }
    </>
  )
}

export default Home