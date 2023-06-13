import React, { useState, useEffect } from 'react'
import { Form, redirect } from 'react-router-dom';
import bcrypt from 'bcryptjs';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitvalid, setSubmitvalid] = useState(false);
  const [usernameValidation, setUsernameValidation] = useState(
    {minChar: false, noSpace: true});
  const [passwordValidation, setPasswordValidation] = useState(
    {minChar: false, noSpace: true, needletter: false, neednumber: false});
  
  useEffect(() => {
    if (usernameValidation.minChar &&
        usernameValidation.noSpace &&
        passwordValidation.minChar &&
        passwordValidation.noSpace &&
        passwordValidation.needletter &&
        passwordValidation.neednumber){
          setSubmitvalid(true);
        } else {
          setSubmitvalid(false);
        }
  }, [usernameValidation, passwordValidation])
  
  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  };

  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync("password", salt);

  async function SubmitSingUp(event) {
    event.preventDefault()
    await fetch("/api/prelogin", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "username": username,
      })
    })
      .then(res => res.json())
      .then(res => console.log(res.message))
      .catch(console.error)
  }

  return (
    <div>
      <h1>Login</h1>
      <Form method="post">
        <div>
          <label>Usuário:</label>
          <input value={username} onChange={handleUsernameChange} id="username" type="text" name="username" required/>
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input value={password} onChange={handlePasswordChange} id="password" type="password" name="password" required/>
        </div>
        <button type="submit" disabled={false}>Login</button>
      </Form>
    </div>
  )
}

export default Login