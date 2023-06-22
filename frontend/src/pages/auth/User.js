import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth_context';
import Username from './inputs/Username';
import Fullname from './inputs/Fullname';
import Password from './inputs/Password';
import StandID from './inputs/StandID';
import bcrypt from 'bcryptjs';

function User() {
  const [user, setUser] = useState({
    username: "",
    fullname: "",
    standID: null});
  const [change, setChange] = useState({
    username:false,
    fullname:false,
    password:false,
    standID:false});
  const [newUsername, setNewUsername] = useState("");
  const [newFullname, setNewFullname] = useState("");
  const [indexKenjinkai, setIndexKenjinkai] = useState(0);
  const [newStand, setNewStand] = useState(null);
  const [newPassword, setNewPassword] = useState({
    oldpassword: "",
    newpassword: ""});
  const [check, setCheck] = useState({
    username: false,
    fullname: false,
    standID: false,
    password: false});
  const [alreadyUsedUN, setAlreadyUsedUN] = useState({username: "", U_noUsed: true});
  const [alreadyUsedFN, setAlreadyUsedFN] = useState({fullname: "", F_noUsed: true});
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {  // Take user initial value
    if (auth.user.authenticated && user.username === "") {
      var resStatus;
      fetch('/api/user')
        .then(res => {
          resStatus = res.status;
          return res.json()})
        .then(data => {
          if (resStatus === 200){
            setNewUsername(data.username)
            setNewFullname(data.fullname)
            setNewStand({
              kenjinkai: data.kenjinkai,
              observation: data.observation
            })
            return setUser(data)
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
    } else if (auth.user.authenticated && user.username !== ""){
      navigate('/login');
    }
  }, [auth, navigate])

  function handleLogout() {
    auth.onLogout()
    navigate('/')
  }

  function handleChange(select) {  // Select editor
    switch (select) {
      case "username":
        return setChange((change) => ({...change, username: true}))
      case "fullname":
        return setChange((change) => ({...change, fullname: true}))
      case "password":
        return setChange((change) => ({...change, password: true}))
      case "kenjinkai":
        return setChange((change) => ({...change, standID: true}))
      default:
        return "";
  }}

  function h_UNChange(value) {  // Username conditions
    setNewUsername(value)
  };
  function h_UNValid(value) {
    setCheck(check => ({...check, username:value}))
  };

  function h_FNChange(value) {  // Fullname conditions
    setNewFullname(value);
  };
  function h_FNValid(value) {
    setCheck(check => ({...check, fullname:value}))
  };

  function handleNewKenjinkai(event) {  // Manage NewKenjinkai State
    if (event.target.id === "kenjinkai") {
      setNewStand((newStand) => ({...newStand, kenjinkai: event.target.value}))
    } else  if(event.target.id === "observation") {
      setNewStand((newStand) => ({...newStand, observation: event.target.value}))
    }
  }
  function h_STValid(value) {
    setCheck(check => ({...check, standID:value}))
  };

  function h_OPWChange(event) {  // Manage NewPassword State
    setNewPassword((newPassword) => ({...newPassword, oldpassword: event.target.value}))
  }
  function h_PWChange(value) {  // Password conditions
    setNewPassword((newPassword) => ({...newPassword, password: value}))
  };
  function h_PWValid(value) {
    setCheck(check => ({...check, password:value}))
  };

  async function SubmitNewUsername(){
    var resStatus;
    fetch("/api/newusername", {  // Pre login get salt
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"username": newUsername})
    })
      .then(res => {
        resStatus = res.status;
        return res.json()})
      .then(data => {
        if (resStatus === 200) {
          setUser(user => ({...user, username: data.username}));
          return setChange((change) => ({...change, username: false}))
        } else if (resStatus === 401) {
          // deal with error
        }
      })
      .catch(console.error)
  }

  async function SubmitNewFullname(){
    var resStatus;
    fetch("/api/newfullname", {  // Pre login get salt
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"fullname": newFullname})
    })
      .then(res => {
        resStatus = res.status;
        return res.json()})
      .then(data => {
        if (resStatus === 200) {
          setUser(user => ({...user, fullname: data.fullname}));
          return setChange((change) => ({...change, fullname: false}))
        } else if (resStatus === 401) {
          // deal with error
        }
      })
      .catch(console.error)
  }

  async function SubmitNewKenjinkai(){
    var resStatus;
    fetch("/api/changestandid", {  // Pre login get salt
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"standID": newStand.standID})
    })
      .then(res => {
        resStatus = res.status;
        return res.json()})
      .then(data => {
        if (resStatus === 200) {
          setUser(user => ({...user, standID: data.standID}));
          return setChange((change) => ({...change, standID: false}))
        } else if (resStatus === 401) {
          // deal with error
        }
      })
      .catch(console.error)
  }

  async function PreSubmitNewPassword(){
    var resStatus;
    fetch("/api/prenewpassword", {  // Pre login get salt
      method: "POST"
    })
      .then(res => {
        resStatus = res.status;
        return res.json()})
      .then(data => {
        if (resStatus === 200) {
          setUser(user => ({...user, standID: data.standID}));
          return setChange((change) => ({...change, standID: false}))
        } else if (resStatus === 401) {
          // deal with error
        }
      })
      .catch(console.error)
  }
  async function SubmitNewPassword(){
    var resStatus;

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword.newpassword, salt);

    fetch("/api/newpassword", {  // Pre login get salt
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "password": newPassword.oldpassword,
        "newpassword": hash,
        "salt": salt})
    })
      .then(res => {
        resStatus = res.status;
        return res.json()})
      .then(data => {
        if (resStatus === 200) {
          return setChange((change) => ({...change, password: false}))
        } else if (resStatus === 401) {
          // deal with error
        }
      })
      .catch(console.error)
  }

  return (
    <div>
      {auth.user.authenticated ?
      <div>
        <div>
          {!change.username?
            <>
              <p>Usuário</p>
              <p onClick={() => {handleChange("username")}}>{user.username}</p>
            </>
          :
            <>
              <Username
                output={h_UNChange}
                valid={h_UNValid}
                dupliValue={alreadyUsedUN.username}
                dupliCheck={alreadyUsedUN.U_noUsed}
                defaultValue={user.username}/>
              <button disabled={check.username ? false : true}>Confirmar</button>
            </>
          }
        </div>
        <div>
          {!change.fullname?
            <>
              <p>Nome completo</p>
              <p onClick={() => {handleChange("fullname")}}>{user.fullname}</p>
            </>
          :
            <>
              <Fullname
                output={h_FNChange}
                valid={h_FNValid}
                dupliValue={alreadyUsedFN.fullname}
                dupliCheck={alreadyUsedFN.F_noUsed}
                defaultValue={user.fullname}/>
              <button disabled={check.fullname ? false : true}>Confirmar</button>
            </>
          }
        </div>
        <div>
          {!change.standID?
            <>
              <p onClick={() => {handleChange("kenjinkai")}}>Estande</p>
              <p>{user.kenjinkai}</p>
              <p>{user.observation}</p>
            </>
          :
            <>
            <StandID/>
            <button disabled={check.standID ? false : true}>Confirmar</button>
            </>
          }
        </div>
        <div>
          {!change.password?
          <button onClick={() => {handleChange("password")}}>
            Alterar Senha
          </button>
          :
          <>
            <label htmlFor="password">Senha atual:</label>
            <input id="oldpassword" type="password" name="oldpassword" value={newPassword.oldpassword} onChange={h_OPWChange}/>
            <Password
              output={h_PWChange}
              valid={h_PWValid}/>
            <button disabled={check.password ? false : true}>Confirmar</button>
          </>
          }
          <button onClick={() => handleLogout}>
            Log out
          </button>
        </div>  
      </div>
      :
      <div>
        <p> Usuário deslogado </p>
      </div>
      }
    </div>
  )
}

export default User