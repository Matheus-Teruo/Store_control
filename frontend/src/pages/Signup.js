import React, { useState, useEffect } from 'react';
import { Form, useNavigate  } from 'react-router-dom';
import bcrypt from 'bcryptjs';

const regexnumber = /[0-9]/
const regexletter = /[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/
const regexspace = /\s/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Signup() {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordC, setPasswordC] = useState("");
  const [submitvalid, setSubmitvalid] = useState(false);
  const [alreadyUsed, setAlreadyUsed] = useState({username: "", U_noUsed: true, fullname: "", F_noUsed: true});
  const [UN_Check, setUN_Check] = useState(
    {haveMinChar: false,
     noSpace: true, 
     noSpecialChar: true});
  const [FN_Check, setFN_Check] = useState(
    {haveMinChar: false, 
     noSpecialChar: true});
  const [PW_Check, setPW_Check] = useState(
    {haveMinChar: false,
     noSpace: true,
     haveLetter: false,
     haveNumber: false});
  const [PW_D_Check, setPW_D_Check] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {  // Check all conditions
    if (UN_Check.haveMinChar &&
        UN_Check.noSpace &&
        UN_Check.noSpecialChar &&
        alreadyUsed.username !== username &&
        FN_Check.haveMinChar &&
        FN_Check.noSpecialChar &&
        alreadyUsed.fullname !== fullname &&
        PW_Check.haveMinChar &&
        PW_Check.noSpace &&
        PW_Check.haveLetter &&
        PW_Check.haveNumber &&
        PW_D_Check){
          setSubmitvalid(true);
        } else {
          setSubmitvalid(false);
        }
  }, [UN_Check, FN_Check, PW_Check, PW_D_Check])

  async function SubmitSingUp(event) {  // Submit POST request sign-up
    event.preventDefault()

    // encrypt password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    var resStatus;

    fetch("/api/signup", {  // Post form
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "username": username,
        "password": hash,
        "salt": salt,
        "fullname": fullname
      })
    })
      .then(res => {
        resStatus = res.status;
        return res.json()})
      .then(data => {
        if (resStatus=== 201){  // Successful sign up
          return navigate('/');
        } else if (resStatus === 409) {  // Duplicate 
          if (data.column === "username") {
            setAlreadyUsed(alreadyUsed => ({...alreadyUsed, username: data.value, U_noUsed: false}))
          } else if (data.column === "fullname") {
            setAlreadyUsed(alreadyUsed => ({...alreadyUsed, fullname: data.value, F_noUsed: false}))
          }
        }
      })
      .catch(console.error)
  }

  useEffect(() => {  // Check password confirmation
    if (password === passwordC) {
      setPW_D_Check(true)
    } else {
      setPW_D_Check(false)
    }
  }, [password, passwordC])

  const handleUsernameChange = (event) => {  // Username conditions
    setUsername(event.target.value)

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

  const handleFullnameChange = (event) => {  // Fullname conditions
    setFullname(event.target.value);

    if (event.target.value.trim().length >= 6) {  // Check min number of char
      setFN_Check(FN_Check => ({...FN_Check, haveMinChar: true})
    )} else {
      setFN_Check(FN_Check => ({...FN_Check, haveMinChar: false})
    )}

    if (!regexspecial.test(event.target.value)) {  // Check use of special char
      setFN_Check(FN_Check => ({...FN_Check, noSpecialChar: true})
    )} else {
      setFN_Check(FN_Check => ({...FN_Check, noSpecialChar: false})
    )};
  };

  const handlePasswordChange = (event) => {  // Password conditions
    setPassword(event.target.value)

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

  const handlePasswordChangeC = (event) => {  // Password confirmation set
    setPasswordC(event.target.value)
  };

  return (
    <div>
      <h1>Sign-up</h1>
      <Form method="post">
        <div>
          <label>Usuário:</label>
          <input value={username} onChange={handleUsernameChange} id="username" type="text" name="username" />
          {!UN_Check.haveMinChar && <div>minChar</div>}
          {!UN_Check.noSpace && <div>noSpace</div>}
          {!UN_Check.noSpecialChar && <div>noCharEspecial</div>}
          {(!alreadyUsed.U_noUsed && (alreadyUsed.username === username)) && <div>noUsed</div>}
          <div>{alreadyUsed.username}</div>
        </div>
        <div>
          <label htmlFor="fullname">Nome Completo:</label>
          <input value={fullname} onChange={handleFullnameChange} id="fullname" type="text" name="fullname" />
          {!FN_Check.haveMinChar && <div>minChar</div>}
          {!FN_Check.noSpecialChar && <div>noCharEspecial</div>}
          {(!alreadyUsed.F_noUsed && (alreadyUsed.fullname === fullname)) && <div>noUsed</div>}
          <div>{alreadyUsed.fullname}</div>
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input value={password} onChange={handlePasswordChange} id="password" type="password" name="password" />
          {!PW_Check.haveMinChar && <div>minChar</div>}
          {!PW_Check.haveLetter && <div>haveletter</div>}
          {!PW_Check.haveNumber && <div>havenumber</div>}
          {!PW_Check.noSpace && <div>noSpace</div>}
        </div>
        <div>
          <label htmlFor="PW_D_Check">Senha:</label>
          <input value={passwordC} onChange={handlePasswordChangeC} id="PW_D_Check" type="password" name="PW_D_Check" />
          {!PW_D_Check && <div>noMatch</div>}
        </div>
        <button onClick={SubmitSingUp} type="submit" disabled={submitvalid ? false : true}>Sign up</button>
      </Form>
    </div>
  )
}

export default Signup