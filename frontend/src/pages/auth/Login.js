import React, { useState, useEffect, useContext } from 'react'
import { Link, Form, useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth_context';
import bcrypt from 'bcryptjs';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitvalid, setSubmitvalid] = useState(false);
  const [processingUN, setProcessingUN] = useState(0);
  const [processingPW, setProcessingPW] = useState(0);
  const [UN_Check, setUN_Check] = useState(false);
  const [PW_Check, setPW_Check] = useState(false);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {  // Check all condition
    if (UN_Check && PW_Check){
      setSubmitvalid(true);
    } else {
      setSubmitvalid(false);
    }
  }, [UN_Check, PW_Check])
  
  const handleChange = (event) => {  // Handle Change
    if (event.target.id === "username") {  // Username conditions
      setUsername(event.target.value)
      setProcessingUN(0);
      if (event.target.value.trim().length >= 4) {  // Check min number of char
        setUN_Check(true)
      } else {
        setUN_Check(false)
      };
    } else if (event.target.id === "password") {  // Fullname conditions
      setPassword(event.target.value);
      setProcessingPW(0);
      if (event.target.value.trim().length >= 6) {  // Check min number of char
        setPW_Check(true)
      } else {
        setPW_Check(false)
      };
    }
  };

  async function SubmitPreLogin(event) {  // Submit POST request prelogin
    event.preventDefault()
    var resStatus;

    fetch("/api/prelogin", {  // Pre login get salt
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "username": username
      })
    })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200) {
          setProcessingUN(1);
          SubmitLogin(data.salt);
        } else if (resStatus === 401) {
          return setProcessingUN(2);
        }
      })
      .catch(console.error)
  }

  async function SubmitLogin(salt) {  // Submit POST request login
    var resStatus;
    const hash = bcrypt.hashSync(password, salt);

    fetch("/api/login", {  // Pre login get salt
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "username": username,
        "password": hash
      })
    })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200) {
          setProcessingPW(1);
          auth.onLogin()
          return navigate('/');
        } else if (resStatus === 401) {
          return setProcessingPW(2);
        }
      })
      .catch(console.error)
  }

  return (
    <div>
      <h1>Login</h1>
      <Form method="post">
        <div>
          <label>Usuário:</label>
          <input value={username} onChange={handleChange} id="username" type="text" name="username" required/>
          {processingUN === 1 && <div>verde</div>}
          {processingUN === 2 && <div>vermelho</div>}
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input value={password} onChange={handleChange} id="password" type="password" name="password" required/>
          {processingPW === 1 && <div>verde</div>}
          {processingPW === 2 && <div>vermelho</div>}
        </div>
        <button onClick={SubmitPreLogin} type="submit" disabled={submitvalid ? false : true}>Login</button>
      </Form>
      <div>
        <Link to="/signup">Sign up</Link>
      </div>
    </div>
  )
}

export default Login