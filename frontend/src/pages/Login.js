import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ShizuokaLogo from "./../midia/Shizuoka.png";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // You can perform login authentication here
    // using the email and password values

    // Example: Printing the login details
    console.log('Username:', username);
    console.log('Password:', password);

    // Reset the form
    setUsername('');
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
      <h1>Login</h1>
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
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
    </>
  )
}

export default Login