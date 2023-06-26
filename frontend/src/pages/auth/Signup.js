import React, { useState, useEffect, useContext} from 'react';
import { Form, useNavigate  } from 'react-router-dom';
import AuthContext from '../../store/auth_context';
import bcrypt from 'bcryptjs';
import Username from './inputs/Username';
import Fullname from './inputs/Fullname';
import Password from './inputs/Password'; 

function Signup() {
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [submitvalid, setSubmitvalid] = useState(false);
  const [alreadyUsedUN, setAlreadyUsedUN] = useState("");
  const [alreadyUsedFN, setAlreadyUsedFN] = useState("");
  const [check, setCheck] = useState({
    username: false,
    fullname: false,
    password: false});
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {  // Check all conditions
    if (check.username &&
        check.fullname &&
        check.password){
      setSubmitvalid(true);
    } else {
      setSubmitvalid(false);
    }
  }, [check])

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
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus=== 201){  // Successful sign up
          auth.onLogin()
          return navigate('/');
        } else if (resStatus === 409) {  // Duplicate 
          if (data.column === "username") {
            setAlreadyUsedUN({username: data.value, U_noUsed: false});
          } else if (data.column === "fullname") {
            setAlreadyUsedFN({fullname: data.value, F_noUsed: false});
          }
        }
      })
      .catch(console.error)
  }

  function h_Change(event) {  // Handle Change
    if (event.target.id === "username") {  // Username
      setUsername(event.target.value)
    } else if (event.target.id === "fullname") {  // Fullname
      setFullname(event.target.value)
    } else if (event.target.id === "password") {  // Password
      setPassword(event.target.value)
    }
  };
  function h_UNValid(value) {
    setCheck(check => ({...check, username:value}))
  };
  function h_FNValid(value) {
    setCheck(check => ({...check, fullname:value}))
  };
  function h_PWValid(value) {
    setCheck(check => ({...check, password:value}))
  };

  return (
    <div>
      <h1>Sign-up</h1>
      <Form method="post">
        <Username
          output={h_Change}
          username={username}
          dupliValue={alreadyUsedUN}
          valid={h_UNValid}/>
        <Fullname
          output={h_Change}
          fullname={fullname}
          dupliValue={alreadyUsedFN}
          valid={h_FNValid}/>
        <Password
          output={h_Change}
          valid={h_PWValid}/>
        <button onClick={SubmitSingUp} type="submit" disabled={submitvalid ? false : true}>Sign up</button>
      </Form>
    </div>
  )
}

export default Signup