import React from 'react'
import { Link } from 'react-router-dom';
import ShizuokaLogo from "./../midia/Shizuoka.png";
import { Clipboard, DollarSign, Database } from 'react-feather';

function Home() {
  return (
    <>
    <header>
        <Link to="/">
          <img src={ShizuokaLogo} alt="Shizuoka Logo"/>
        </Link>
        <div>Welcome, John Doe!</div> {/* Replace "John Doe" with the username */}
    </header>
    <div className="container">
      <div className="frame">
        <Link to="/vendedor">
          <Clipboard alt="Vendedor"/>
        </Link>
      </div>
      <div className="frame">
        <Link to="/caixa">
          <DollarSign alt="Caixa"/>
        </Link>
      </div>
      <div className="frame">
        <Link to="/database">
          <Database alt="Database"/>
        </Link>
      </div>
    </div>
    </>
  )
}

export default Home