import React, { useState, useEffect } from 'react'
import { Form, useNavigate } from 'react-router-dom';
import bcrypt from 'bcryptjs';

const regexnumber = /[0-9]/
const regexletter = /[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/
const regexspace = /\s/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitvalid, setSubmitvalid] = useState(false);
  const [processing, setProcessing] = useState({username: false, UN_Confimed: false, password: false, PW_Confirmed: false});
  const [UN_Check, setUN_Check] = useState(
    {haveMinChar: false,
     noSpace: true, 
     noSpecialChar: true});
  const [PW_Check, setPW_Check] = useState(
    {haveMinChar: false,
     noSpace: true,
     haveLetter: false,
     haveNumber: false});
  const navigate = useNavigate();

  useEffect(() => {
    if (UN_Check.haveMinChar &&
        UN_Check.noSpace &&
        UN_Check.noSpecialChar &&
        PW_Check.haveMinChar &&
        PW_Check.noSpace &&
        PW_Check.haveLetter &&
        PW_Check.haveNumber){
          setSubmitvalid(true);
        } else {
          setSubmitvalid(false);
        }
  }, [UN_Check, PW_Check])
  
  const handleUsernameChange = (event) => {  // Username conditions
    setUsername(event.target.value)
    setProcessing((processing) => ({...processing, username: false, UN_Confimed: false}));

    if (event.target.value.trim().length >= 4) {  // Check min number of char
      setUN_Check(UN_Check => ({...UN_Check, haveMinChar: true})
    )} else {
      setUN_Check(UN_Check => ({...UN_Check, haveMinChar: false})
    )};

    if (!regexspace.test(event.target.value)) {  // Check use of space
      setUN_Check(UN_Check => ({...UN_Check, noSpace: true})
    )} else {
      setUN_Check(UN_Check => ({...UN_Check, noSpace: false})
    )};

    if (!regexspecial.test(event.target.value)) {  // Check use of special char
      setUN_Check(UN_Check => ({...UN_Check, noSpecialChar: true})
    )} else {
      setUN_Check(UN_Check => ({...UN_Check, noSpecialChar: false})
    )};
  };

  const handlePasswordChange = (event) => {  // Password conditions
    setPassword(event.target.value);
    setProcessing((processing) => ({...processing, password: false, PW_Confimed: false}));

    if (event.target.value.trim().length >= 6) {  // Check min number of char
      setPW_Check(PW_Check => ({...PW_Check, haveMinChar: true})
    )} else {
      setPW_Check((PW_Check) => ({...PW_Check, haveMinChar: false})
    )};

    if (regexletter.test(event.target.value)) {  // Check letter in password
      setPW_Check((PW_Check) => ({...PW_Check, haveLetter: true})
    )} else {
      setPW_Check((PW_Check) => ({...PW_Check, haveLetter: false})
    )};

    if (regexnumber.test(event.target.value)) {  // Check number in password
      setPW_Check(PW_Check => ({...PW_Check, haveNumber: true})
    )} else {
      setPW_Check(PW_Check => ({...PW_Check, haveNumber: false})
    )};

    if (!regexspace.test(event.target.value)) {  // Check use of space
      setPW_Check(PW_Check => ({...PW_Check, noSpace: true})
    )} else {
      setPW_Check((PW_Check) => ({...PW_Check, noSpace: false})
    )};
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
          setProcessing((processing) => ({...processing, username: true, UN_Confimed: true}));
          SubmitLogin(data.salt);
        } else if (resStatus === 401) {
          return setProcessing((processing) => ({...processing, username: true, UN_Confimed: false}));
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
          setProcessing((processing) => ({...processing, password: true, PW_Confimed: true}));
          return navigate('/');
        } else if (resStatus === 401) {
          return setProcessing((processing) => ({...processing, password: true, PW_Confimed: false}));
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
          {processing.username && processing.UN_Confimed && <div>verde</div>}
          {processing.username && !processing.UN_Confimed && <div>vermelho</div>}
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input value={password} onChange={handlePasswordChange} id="password" type="password" name="password" required/>
          {processing.password && processing.PW_Confimed && <div>verde</div>}
          {processing.password && !processing.PW_Confimed && <div>vermelho</div>}
        </div>
        <button onClick={SubmitPreLogin} type="submit" disabled={submitvalid ? false : true}>Login</button>
      </Form>
    </div>
  )
}

export default Login