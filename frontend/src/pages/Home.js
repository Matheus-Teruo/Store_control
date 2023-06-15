import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Clipboard, DollarSign, Table, Database } from 'react-feather';
import AuthContext from '../store/auth_context';

function Home() {
  const auth = useContext(AuthContext);

  useEffect(() => {
    return (auth.onLogin());
  }, [])

  return (
    <div className="container">
      <div>{auth.user.authenticated}</div>
      {auth.user.authenticated?
        <>
          <div>
            EVENTO 
          </div>
          <div>
            <div className="frame">
              <Link to="/vendedor">
                <Clipboard alt="Vendedor"/>
                <p>vendedor</p>
              </Link>
            </div>
            <div className="frame">
              <Link to="/caixa">
                <DollarSign alt="Caixa"/>
                <p>Caixa</p>
              </Link>
            </div>
            <div className="frame">
              <Link to="/inventario">
                <Table alt="Sheets"/>
                <p>Inventário</p>
              </Link>
            </div>
            <div className="frame">
              <Link to="/admin/database">
                <Database alt="Database"/>
                <p>Database</p>
              </Link>
            </div>
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