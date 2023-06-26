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
    kenjinkai: "",
    stand: "",
    superuser: 0});
  const [change, setChange] = useState({
    username:false,
    fullname:false,
    password:false,
    standID:false});
  const [newUsername, setNewUsername] = useState("");
  const [newFullname, setNewFullname] = useState("");
  const [newStandID, setNewStandID] = useState(null);
  const [newPassword, setNewPassword] = useState({
    oldpassword: "",
    newpassword: ""});
  const [check, setCheck] = useState({
    username: false,
    fullname: false,
    password: false});
  const [alreadyUsedUN, setAlreadyUsedUN] = useState("");
  const [alreadyUsedFN, setAlreadyUsedFN] = useState("");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {  // Take user initial value
    if (auth.user.authenticated === true && user.username === "") {
      RequisiteList()
    } else if (auth.user.authenticated === true && user.username !== ""){ // Special case logout
      navigate('/login');
    }
  }, [auth, navigate])

  function RequisiteList() {
    var resStatus;
    fetch('/api/user')
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200){
          setNewUsername(data.username)
          setNewFullname(data.fullname)
          setNewStandID(data.standID)
          return setUser({
            username: data.username,
            fullname: data.fullname,
            kenjinkai: data.kenjinkai,
            stand: data.stand,
            superuser: data.superuser})
        } else if (resStatus === 401){
          return auth.onLogout()
        }
      })
  }

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

  function h_Change(event) {  // Handle Change
    if (event.target.id === "username") {  // Username
      setNewUsername(event.target.value)
    } else if (event.target.id === "fullname") {  // Fullname
      setNewFullname(event.target.value);
    } else if (event.target.id === "oldpassword") {  // Old Password
      setNewPassword((newPassword) => ({...newPassword, oldpassword: event.target.value}));
    } else if (event.target.id === "password") {  // New Password
      setNewPassword((newPassword) => ({...newPassword, newpassword: event.target.value}));
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

  function h_SChange(value) {  // Manage NewKenjinkai State
    const aux = parseInt(value)
    if (aux === 0) {
      setNewStandID(null)
    } else {
      setNewStandID(aux)
    }
  }

  async function SubmitEditUsername(){
    if (check.username){
      var resStatus;
      fetch("/api/editusername", {  // Pre login get salt
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"username": newUsername})
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200) {
            setUser(user => ({...user, username: data.username}));
            return setChange((change) => ({...change, username: false}))
          } else if (resStatus === 409) {
            setAlreadyUsedUN(data.value);
          }
        })
        .catch(console.error)
    }
  }

  async function SubmitEditFullname(){
    var resStatus;
    fetch("/api/editfullname", {  // Pre login get salt
      method: "POST", headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"fullname": newFullname})
    })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200) {
          setUser(user => ({...user, fullname: data.fullname}));
          return setChange((change) => ({...change, fullname: false}))
        } else if (resStatus === 409) {
          setAlreadyUsedFN(data.value);
        }
      })
      .catch(console.error)
  }

  async function SubmitChangeStand(){
    var resStatus;
    fetch("/api/changestandid", {  // Pre login get salt
      method: "POST", headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"standID": newStandID})
    })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200) {
          setUser(user => ({...user, standID: data.standID}));
          setChange((change) => ({...change, standID: false}));
          return RequisiteList();
        } else if (resStatus === 401) {
          // deal with error
        }
      })
      .catch(console.error)
  }

  async function PreSubmitEditPassword(){
    var resStatus;
    fetch("/api/preeditpassword", {  // Pre login get salt
      method: "POST", headers: {'Content-Type': 'application/json'},
      body: JSON.stringify([])
    })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200) {
          return SubmitEditPassword(data.salt)
        } else if (resStatus === 401) {
          // deal with error
        }
      })
      .catch(console.error)
  }
  async function SubmitEditPassword(salt){
    var resStatus;
    const oldhash = bcrypt.hashSync(newPassword.oldpassword, salt);
    const newsalt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword.newpassword, newsalt);

    fetch("/api/editpassword", {  // Pre login get salt
      method: "POST", headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "password": oldhash,
        "newpassword": hash,
        "salt": newsalt})
    })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200) {
          setUser(user => ({...user, standID: data.standID}));
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
                output={h_Change}
                username={newUsername}
                dupliValue={alreadyUsedUN}
                valid={h_UNValid}/>
              <button onClick={() => (SubmitEditUsername())} disabled={check.username ? false : true}>Confirmar</button>
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
                output={h_Change}
                fullname={newFullname}
                dupliValue={alreadyUsedFN}
                valid={h_FNValid}/>
              <button onClick={() => (SubmitEditFullname())} disabled={check.fullname ? false : true}>Confirmar</button>
            </>
          }
        </div>
        <div>
          {!change.standID?
            <>
              <p onClick={() => {handleChange("kenjinkai")}}>Estande</p>
              <p>{user.kenjinkai}</p>
              <p>{user.stand}</p>
            </>
          :
            <>
            <StandID
              output={h_SChange}
              defaultValue={newStandID}/>
            <button onClick={() => (SubmitChangeStand())}>Confirmar</button>
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
            <input value={newPassword.oldpassword} onChange={h_Change} id="oldpassword" type="password" name="oldpassword"/>
            <Password
              output={h_Change}
              valid={h_PWValid}/>
            <button onClick={() => PreSubmitEditPassword()} disabled={check.password ? false : true}>Confirmar</button>
          </>
          }
          <button onClick={() => handleLogout()}>
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