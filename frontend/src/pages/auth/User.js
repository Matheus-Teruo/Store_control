import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth_context';
import Username from './inputs/Username';
import Fullname from './inputs/Fullname';
import Password from './inputs/Password';
// import StandID from './inputs/StandID';
import bcrypt from 'bcryptjs';

function User() {
  const [user, setUser] = useState({
    username: "",
    fullname: "",
    association: "",
    stand: "",
    superuser: 0});
  const [selected, setSelected] = useState({
    username:false,
    fullname:false,
    password:false});
  const [newUsername, setNewUsername] = useState("");
  const [newFullname, setNewFullname] = useState("");
  // const [newStandID, setNewStandID] = useState(null);
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

  useEffect(() => {  // Page requirements
    if (auth.user.authenticated === true && user.username === "") {
      RequestUserData()
    } else if (auth.user.authenticated === false && user.username !== ""){ // Special case logout
      navigate('/login');
    }
  }, [auth, user, navigate])

  function RequestUserData() {  // Request user data
    var resStatus;
    fetch('/api/user')
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200){
          setNewUsername(data.username)
          setNewFullname(data.fullname)
          // setNewStandID(data.standID)
          return setUser({
            username: data.username,
            fullname: data.fullname,
            association: data.association,
            stand: data.stand,
            superuser: data.superuser})
        } else if (resStatus === 401){
          return auth.onLogout()
        }
      })
  }

  async function SubmitEditUsername(){  // Submit edit username
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
            return setSelected((selected) => ({...selected, username: false}))
          } else if (resStatus === 409) {
            setAlreadyUsedUN(data.value);
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch(console.error)
    }
  }

  async function SubmitEditFullname(){  // Submit edit fullname
    if (check.fullname){
      var resStatus;
      fetch("/api/editfullname", {  // Pre login get salt
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"fullname": newFullname})
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200) {
            setUser(user => ({...user, fullname: data.fullname}));
            return setSelected((selected) => ({...selected, fullname: false}))
          } else if (resStatus === 409) {
            setAlreadyUsedFN(data.value);
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch(console.error)
    }
  }

  async function PreSubmitEditPassword(){  // Submit take salt
    if (check.password){
      var resStatus;
      fetch("/api/preeditpassword", {  // Pre login get salt
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify([])
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200) {
            return SubmitEditPassword(data.salt)
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch(console.error)
    }
  }

  async function SubmitEditPassword(salt){  // Submit edit password
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
          return setSelected((selected) => ({...selected, password: false}))
        }  else if (resStatus === 401){
          return auth.onLogout()
        }
      })
      .catch(console.error)
  }

  function SubmitLogout() {  // Submit Log out
    auth.onLogout()
    navigate('/')
  }

  function handleSelected(select) {  // Select editor
    switch (select) {
      case "username":
        return setSelected((selected) => ({...selected, username: true}))
      case "fullname":
        return setSelected((selected) => ({...selected, fullname: true}))
      case "password":
        return setSelected((selected) => ({...selected, password: true}))
      default:
        return "";
  }}

  function handleChange(event) {  // Handle Change
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

  // function h_SChange(value) {  // Manage stand ID
  //   const aux = parseInt(value)
  //   if (aux === 0) {
  //     setNewStandID(null)
  //   } else {
  //     setNewStandID(aux)
  //   }
  // }

  // async function SubmitChangeStand(){
  //   var resStatus;
  //   fetch("/api/changestandid", {  // Pre login get salt
  //     method: "POST", headers: {'Content-Type': 'application/json'},
  //     body: JSON.stringify({"standID": newStandID})
  //   })
  //     .then(res => {resStatus = res.status; return res.json()})
  //     .then(data => {
  //       if (resStatus === 200) {
  //         setUser(user => ({...user, standID: data.standID}));
  //         setSelected((selected) => ({...selected, standID: false}));
  //         return RequestUserData();
  //       }  else if (resStatus === 401){
  //         return auth.onLogout()
  //       }
  //     })
  //     .catch(console.error)
  // }

  return (
    <div>
      {auth.user.authenticated ?
      <div>
        <div>
          {!selected.username?
            <>
              <p>Usuário</p>
              <p onClick={() => {handleSelected("username")}}>{user.username}</p>
            </>
          :
            <>
              <Username
                output={handleChange}
                username={newUsername}
                dupliValue={alreadyUsedUN}
                valid={(value) => setCheck(check => ({...check, username:value}))}/>
              <button onClick={() => (SubmitEditUsername())} disabled={check.username ? false : true}>Confirmar</button>
            </>
          }
        </div>
        <div>
          {!selected.fullname?
            <>
              <p>Nome completo</p>
              <p onClick={() => {handleSelected("fullname")}}>{user.fullname}</p>
            </>
          :
            <>
              <Fullname
                output={handleChange}
                fullname={newFullname}
                dupliValue={alreadyUsedFN}
                valid={(value) => setCheck(check => ({...check, fullname:value}))}/>
              <button onClick={() => (SubmitEditFullname())} disabled={check.fullname ? false : true}>Confirmar</button>
            </>
          }
        </div>
        <div>
          <p>Estande</p>
          <p>{user.association}</p>
          <p>{user.stand}</p>
            {/* <>
               <StandID
                 output={h_SChange}
                 defaultValue={newStandID}/>
                <button onClick={() => (SubmitChangeStand())}>Confirmar</button>
             </> */}
        </div>
        <div>
          {!selected.password?
          <button onClick={() => {handleSelected("password")}}>
            Alterar Senha
          </button>
          :
          <>
            <label htmlFor="password">Senha atual:</label>
            <input value={newPassword.oldpassword} onChange={handleChange} id="oldpassword" type="password" name="oldpassword"/>
            <Password
              output={handleChange}
              valid={(value) => setCheck(check => ({...check, password:value}))}/>
            <button onClick={() => PreSubmitEditPassword()} disabled={check.password ? false : true}>Confirmar</button>
          </>
          }
          <button onClick={() => SubmitLogout()}>
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