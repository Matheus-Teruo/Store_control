import './Login.css'
import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link, Form, useNavigate } from 'react-router-dom';
import { User, UserCheck, UserX, Lock, Unlock, ArrowRight } from 'react-feather';
import AuthContext from '../../store/auth_context';
import bcrypt from 'bcryptjs';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isFocUN, setIsFocUN] = useState(false);
  const [isFocPW, setIsFocPW] = useState(false);
  const [submitvalid, setSubmitvalid] = useState(false);
  const [processingUN, setProcessingUN] = useState(0);
  const [processingPW, setProcessingPW] = useState(0);
  const [UN_Check, setUN_Check] = useState(false);
  const [PW_Check, setPW_Check] = useState(false);
  const [animationUN, setAnimationUN] = useState(false)
  const [animationPW, setAnimationPW] = useState(false)
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const inputRef = useRef(null);

  useEffect(() => {  // Check all condition
    if (UN_Check && PW_Check){
      setSubmitvalid(true);
    } else {
      setSubmitvalid(false);
    }
  }, [UN_Check, PW_Check])

  async function SubmitPreLogin(event) {  // Submit prelogin
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
          if (inputRef.current) {
            inputRef.current.blur();
          }
          setProcessingUN(1);
          if (processingUN === 1) {
            return SubmitLogin(data.salt);
          } else {
            setTimeout(() => {
              SubmitLogin(data.salt);
            }, 500);
          }
        } else if (resStatus === 401) {
          setProcessingUN(2);
          setAnimationUN(true);
          setTimeout(() => {
            setAnimationUN(false);
          }, 1000);
        } else if (resStatus === 403) {  // Forbiten try login while logged
          return navigate('/')
        }
      })
      .catch(console.error)
  }

  async function SubmitLogin(salt) {  // Submit login
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
          return setTimeout(() => {
            navigate('/');
          }, 500); 
        } else if (resStatus === 401) {
          setProcessingPW(2);
          setAnimationPW(true);
          setTimeout(() => {
            setAnimationPW(false);
          }, 1000);
        }
      })
      .catch(console.error)
  }

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

  const classUsername = `LoginInput ${isFocUN ? 'focused' : processingUN === 1 ? 'unfocOK' : processingUN === 2 && 'unfocNO'}`
  const classPassword = `LoginInput ${isFocPW ? 'focused' : processingPW === 1 ? 'unfocOK' : processingPW === 2 && 'unfocNO'}`

  return (
    <div className="L_background">
      <div className="L_body">
        <h1>Login</h1>
        <Form className="L_form" method="post">
          <div className={classUsername} onFocus={() => setIsFocUN(true)} onBlur={() => setIsFocUN(false)}>
            <label className={`${animationUN ? 'shake' : ''}`} htmlFor="username">
              {processingUN === 0 ?
                <User/>
              : processingUN === 1 ?
                <UserCheck className="IconUser"/>
              : processingUN === 2 &&
                <UserX className="IconUser"/>
              }
            </label>
            <input value={username} onChange={handleChange} placeholder="Usuário" id="username" type="text" name="username" required/>
          </div>
          <div className={classPassword} onFocus={() => setIsFocPW(true)} onBlur={() => setIsFocPW(false)}>
            <label className={`${animationPW ? 'shake' : ''}`} htmlFor="password">
              {processingPW === 0 ?
                <Lock/>
              : processingPW === 1 ?
                <Unlock/>
              : processingPW === 2 &&
                <Lock/>
              }
            </label>
            <input value={password} onChange={handleChange} ref={inputRef} placeholder="Senha" id="password" type="password" name="password" required/>
          </div>
          <div className="L_submit">
            <button onClick={SubmitPreLogin} type="submit" disabled={submitvalid ? false : true}><p>Entrar</p><ArrowRight/></button>
          </div>
        </Form>
        <div className="L_signup">
          <p>Não esta cadastrado?</p>
          <Link to="/signup">Cadastre-se</Link>
        </div>
      </div>
    </div>
  )
}

export default Login