import React from 'react'
import { Link } from 'react-router-dom';
import { Clipboard, DollarSign, Table, Database } from 'react-feather';

function Home() {
  return (
    <div className="container">
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
        <Link to="/database">
          <Database alt="Database"/>
          <p>Database</p>
        </Link>
      </div>
    </div>
  )
}

export default Home