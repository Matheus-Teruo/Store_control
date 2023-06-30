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

  async function SubmitSingUp(event) {  // Submit sign-up
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
        } else if (resStatus === 403) {  // Forbiten create user logged
          return navigate('/')
        }
      })
      .catch(console.error)
  }

  function handleChange(event) {  // Handle Change
    if (event.target.id === "username") {  // Username
      setUsername(event.target.value)
    } else if (event.target.id === "fullname") {  // Fullname
      setFullname(event.target.value)
    } else if (event.target.id === "password") {  // Password
      setPassword(event.target.value)
    }
  };

  return (
    <div>
      <h1>Sign-up</h1>
      <Form method="post">
        <Username
          output={handleChange}
          username={username}
          dupliValue={alreadyUsedUN}
          valid={(value) => setCheck(check => ({...check, username:value}))}/>
        <Fullname
          output={handleChange}
          fullname={fullname}
          dupliValue={alreadyUsedFN}
          valid={(value) => setCheck(check => ({...check, fullname:value}))}/>
        <Password
          output={handleChange}
          valid={(value) => setCheck(check => ({...check, password:value}))}/>
        <button onClick={SubmitSingUp} type="submit" disabled={submitvalid ? false : true}>Sign up</button>
      </Form>
    </div>
  )
}

export default Signup