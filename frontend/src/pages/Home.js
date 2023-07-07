import './Home.css';
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Clipboard, DollarSign, Package, Users, CreditCard, Flag } from 'react-feather';
import AuthContext from '../store/auth_context';

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
      <div className="Body">
        <h1 className="MainTitle">
          Store Control
        </h1>
        <div className="MainSection">
          <div className="MainSubtitle">
            <h2>Funções</h2>
          </div>
          <div className="MainRole">
            {user.standID > 1 ?
            <Link className="MainFrame" to="/seller">
              <Clipboard alt="Vendedor"/>
              <p>vendedor</p>
            </Link>
            :
            <div className="MainFrame invalid">
              <Clipboard alt="Vendedor"/>
              <p>vendedor</p>
            </div>
            }
            {user.standID === 1 || user.superuser === 1 ?
            <Link className="MainFrame" to="/cashier">
              <DollarSign alt="Caixa"/>
              <p>Caixa</p>
            </Link>
            :
            <div className="MainFrame invalid">
              <DollarSign alt="Caixa"/>
              <p>Caixa</p>
            </div>
            }
          </div>
          {user.standID !== null && user.standID !== 1 ? 
          <Link className="MainStocktaking" to="/stocktaking">
            <Package alt="Stock"/>
            <p>Inventário</p>
          </Link>
          :
          <div className="MainStocktaking invalid">
            <Package alt="Stock"/>
            <p>Inventário</p>
          </div>
          }
          {user.superuser === 1 &&
          <>
          <div className="MainSubtitle">
            <h2>Administrador</h2>
          </div>
          <div className="MainAdmin">
            <Link className="MainFrame2" to="/admin/allusers">
              <Users alt="Users"/>
              <p>Usuários</p>
            </Link>  
            <Link className="MainFrame2" to="/admin/cards">
              <CreditCard alt="Cards"/>
              <p>Cartões</p>
            </Link>
            <Link className="MainFrame2" to="/admin/database">
              <Flag alt="Database"/>
              <p>Associações</p>
            </Link>
          </div>
          </>
          }
        </div>
      </div>
    :
      <div className="Home">
        <h1 className="HomeTitle">
          Store Control
        </h1>
        <div className="HomeUser">
          <Link className="HomeAuth" to="/login">Entre</Link>
          <p className="Hometext">ou</p>
          <Link className="HomeAuth" to="/signup">Cadastre-se</Link>
        </div>
      </div>
    }
    </>
  )
}

export default Home