import "./User.css"
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { User, Smile, Flag, Lock } from 'react-feather';
import AuthContext from '../../store/auth_context';
import Username from './inputs/Username';
import Fullname from './inputs/Fullname';
import Password from './inputs/Password';
import bcrypt from 'bcryptjs';

function UserPage() {
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
  const [newPassword, setNewPassword] = useState({
    oldpassword: "",
    newpassword: ""});
  const [check, setCheck] = useState({
    username: false,
    fullname: false,
    oldpassword: false,
    password: false});
  const [alreadyUsedUN, setAlreadyUsedUN] = useState("");
  const [alreadyUsedFN, setAlreadyUsedFN] = useState("");
  const [isFoc, setIsFoc] = useState(false);
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
      if (user.username !== newUsername){
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
      } else {
        setSelected((selected) => ({...selected, username: false}))
      }
    }
  }

  async function SubmitEditFullname(){  // Submit edit fullname
    if (check.fullname){
      if (user.fullname !== newFullname) {
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
      } else {
        setSelected((selected) => ({...selected, fullname: false}))
      }
    }
  }

  async function PreSubmitEditPassword(){  // Submit take salt
    if (check.password){
      if (newPassword.oldpassword !== newPassword.newpassword) {
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
      } else {
        setSelected((selected) => ({...selected, password: false}))
      }
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
          
          return setTimeout(() => {
            setSelected((selected) => ({...selected, password: false}));
          }, 1000);
        } else if (resStatus === 401){
          return auth.onLogout()
        } else if (resStatus === 406){
          return setNewPassword((newPassword) => ({...newPassword, oldpassword: ""}));
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
      if (event.target.value.trim().length >= 6) {  // Check min number of char
        setCheck(check => ({...check, oldpassword:true}))
      } else {
        setCheck(check => ({...check, oldpassword:false}))
      };
    } else if (event.target.id === "password") {  // New Password
      setNewPassword((newPassword) => ({...newPassword, newpassword: event.target.value}));
    }
  };

  const classPassword = `SignupInput ${isFoc ? 'focused' : (newPassword.oldpassword === "" ? "" : check.oldpassword ? 'unfocOK' : 'unfocNO')}`

  return (
    <>
      {auth.user.authenticated ?
      <div className="Userbackground">
        {!selected.username?
          <div className="UserUN" onClick={() => {handleSelected("username")}}>
            <User/>
            <p>{user.username}</p>
          </div>
        :
          <div className="UserUN">
            <Username
              output={handleChange}
              username={newUsername}
              dupliValue={alreadyUsedUN}
              valid={(value) => setCheck(check => ({...check, username:value}))}/>
            <button onClick={() => (SubmitEditUsername())} disabled={check.username ? false : true}>Confirmar</button>
          </div>
        }
        {!selected.fullname?
          <div className="UserFN" onClick={() => {handleSelected("fullname")}}>
            <Smile/>
            <p>{user.fullname}</p>
          </div>
        :
          <div className="UserFN">
            <Fullname
              output={handleChange}
              fullname={newFullname}
              dupliValue={alreadyUsedFN}
              valid={(value) => setCheck(check => ({...check, fullname:value}))}/>
            <button onClick={() => (SubmitEditFullname())} disabled={check.fullname ? false : true}>Confirmar</button>
          </div>
        }
        <div className="UserAS">
          <Flag/>
          <p>{user.association}</p>
          <p>{user.stand}</p>
        </div>
        {selected.password &&
          <div className="UserPW">
            <div className="UserPasswords">
              <div className="UserOldPassword">
                <div className={classPassword} onFocus={() => setIsFoc(true)} onBlur={() => setIsFoc(false)}>
                  <label htmlFor="password"><Lock/></label>
                  <input value={newPassword.oldpassword} onChange={handleChange} placeholder="Senha Atual" id="oldpassword" type="password" name="oldpassword"/>
                </div>
              </div>
              <Password
                output={handleChange}
                placeholder={"Nova Senha"}
                valid={(value) => setCheck(check => ({...check, password:value}))}/>
            </div>
            <div className="UserPasswordButtons">
              <button onClick={() => setSelected((selected) => ({...selected, password: false}))}>Cancelar</button>
              <button onClick={() => PreSubmitEditPassword()} disabled={check.password ? false : true}>Confirmar</button>
            </div>          
          </div>
        }
        <div className="UserMenu">
          {!selected.password &&
          <button onClick={() => {handleSelected("password")}}>
            Alterar Senha
          </button>
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
    </>
  )
}

export default UserPage