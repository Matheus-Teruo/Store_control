import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import { Clipboard, DollarSign, Table, Users, CreditCard, Database } from 'react-feather';
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
  }, [auth])

  return (
    <div className="container">
      {auth.user.authenticated === true ?
        <>
          <div>
            EVENTO 
          </div>
          <div>
            <div className="frame">
              {user.standID > 1 ?
              <Link to="/vendedor">
                <Clipboard alt="Vendedor"/>
                <p>vendedor</p>
              </Link>
              :
              <div>
                <Clipboard alt="Vendedor"/>
                <p>vendedor</p>
              </div>
              }
            </div>
            <div className="frame">
              {user.standID === 1 ?
              <Link to="/caixa">
                <DollarSign alt="Caixa"/>
                <p>Caixa</p>
              </Link>
              :
              <div>
                <DollarSign alt="Caixa"/>
                <p>Caixa</p>
              </div>
              }
            </div>
            <div className="frame">
              {user.standID !== null && user.standID !== 1 ? 
              <Link to="/inventario">
                <Table alt="Sheets"/>
                <p>Inventário</p>
              </Link>
              :
              <div>
                <Table alt="Sheets"/>
                <p>Inventário</p>
              </div>
              } 
            </div>
            {user.superuser === 1 && 
              <div>
                <Link to="/admin/allusers">
                  <Users alt="Users"/>
                  <p>Usuários</p>
                </Link>  
              </div>
            }
            {user.superuser === 1 && 
              <div>
                <Link to="/admin/cards">
                  <CreditCard alt="Cards"/>
                  <p>Cartões</p>
                </Link>  
              </div>
            }
            {user.superuser === 1 && 
              <div className="frame">
                <Link to="/admin/database">
                  <Database alt="Database"/>
                  <p>Database</p>
                </Link>
              </div>
            }
          </div>
        </>
      :
        <>
          <div>
            Hello to ...
          </div>
          <div>
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
          </div>
        </>
      }
    </div>
  )
}

export default Home