import "./Signup.css"
import React, { useState, useEffect, useContext } from 'react';
import { Form, useNavigate } from 'react-router-dom';
import { CheckSquare } from 'react-feather';
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
  const [requiredField, setRequiredField] = useState(0)
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
    // encrypt password\
    if (submitvalid) { const salt = bcrypt.genSaltSync(10);
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
    } else {
      if (requiredField === 1){
        setRequiredField(2)
      } else {
        setRequiredField(1)
      }
    }
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
    <div className="S_background">
      <div className="S_body">
        <h1>Sign-up</h1>
        <Form method="post">
          <div className="S_Inputs">
            <Username
              output={handleChange}
              username={username}
              dupliValue={alreadyUsedUN}
              requiredField={requiredField}
              valid={(value) => setCheck(check => ({...check, username:value}))}/>
          </div>
          <div className="S_Inputs">
            <Fullname
              output={handleChange}
              fullname={fullname}
              dupliValue={alreadyUsedFN}
              requiredField={requiredField}
              valid={(value) => setCheck(check => ({...check, fullname:value}))}/>
          </div>
          <div className="S_Inputs">
            <Password
              output={handleChange}
              requiredField={requiredField}
              valid={(value) => setCheck(check => ({...check, password:value}))}/>
          </div>
          <div className="S_Submit">
            <button className={submitvalid? '' : 'invalid'} onClick={SubmitSingUp} type="submit"><p>Cadastrar</p><CheckSquare/></button>
          </div>
        </Form>
      </div>
    </div>
  )
}

export default Signup