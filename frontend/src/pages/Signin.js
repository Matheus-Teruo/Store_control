import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ShizuokaLogo from "./../midia/Shizuoka.png";

function Signin() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // You can perform sign-up logic here
    // using the name, email, and password values

    // Example: Printing the sign-up details
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);

    // Reset the form
    setUsername('');
    setEmail('');
    setPassword('');
  };

  return (
    <>
    <header>
        <Link to="/">
          <img src={ShizuokaLogo} alt="Shizuoka Logo"/>
        </Link>
        <div>Welcome, John Doe!</div> {/* Replace "John Doe" with the username */}
    </header>
    <div>
      <h1>Sign-up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuário:</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Sign up</button>
      </form>
    </div>
    </>
  )
}

export default Signin