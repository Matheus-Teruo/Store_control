import React from 'react'
import { Link } from 'react-router-dom';
import ShizuokaLogo from "./../midia/Shizuoka.png";

function Database() {
  return (
    <>
    <header>
        <Link to="/">
          <img src={ShizuokaLogo} alt="Shizuoka Logo"/>
        </Link>
        <div>Welcome, John Doe!</div> {/* Replace "John Doe" with the username */}
    </header>
    <div>Database</div>
    </>
  )
}

export default Database