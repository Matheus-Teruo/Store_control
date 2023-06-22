import React, { useState, useEffect, useContext } from 'react'
import { Link, Form, useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth_context';
import bcrypt from 'bcryptjs';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitvalid, setSubmitvalid] = useState(false);
  const [processingUN, setProcessingUN] = useState({username: false, UN_Confimed: false});
  const [processingPW, setProcessingPW] = useState({password: false, PW_Confirmed: false});
  const [UN_Check, setUN_Check] = useState(false);
  const [PW_Check, setPW_Check] = useState(false);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (UN_Check && PW_Check){
      setSubmitvalid(true);
    } else {
      setSubmitvalid(false);
    }
  }, [UN_Check, PW_Check])
  
  const handleUsernameChange = (event) => {  // Username conditions
    setUsername(event.target.value)
    setProcessingUN({username: false, UN_Confimed: false});

    if (event.target.value.trim().length >= 4) {  // Check min number of char
      setUN_Check(true)
    } else {
      setUN_Check(false)
    };
  };

  const handlePasswordChange = (event) => {  // Password conditions
    setPassword(event.target.value);
    setProcessingPW({password: false, PW_Confimed: false});

    if (event.target.value.trim().length >= 6) {  // Check min number of char
      setPW_Check(true)
    } else {
      setPW_Check(false)
    };
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
      .then(res => {
        resStatus = res.status;
        return res.json()})
      .then(data => {
        if (resStatus === 200) {
          setProcessingUN({username: true, UN_Confimed: true});
          SubmitLogin(data.salt);
        } else if (resStatus === 401) {
          return setProcessingUN({username: true, UN_Confimed: false});
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
      .then(res => {
        resStatus = res.status;
        return res.json()})
      .then(data => {
        if (resStatus === 200) {
          setProcessingPW({password: true, PW_Confimed: true});
          auth.onLogin()
          return navigate('/');
        } else if (resStatus === 401) {
          return setProcessingPW({password: true, PW_Confimed: false});
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
          <input value={username} onChange={handleUsernameChange} id="username" type="text" name="username" required/>
          {processingUN.username && processingUN.UN_Confimed && <div>verde</div>}
          {processingUN.username && !processingUN.UN_Confimed && <div>vermelho</div>}
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input value={password} onChange={handlePasswordChange} id="password" type="password" name="password" required/>
          {processingPW.password && processingPW.PW_Confimed && <div>verde</div>}
          {processingPW.password && !processingPW.PW_Confimed && <div>vermelho</div>}
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