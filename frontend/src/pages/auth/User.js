import "./User.css"
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { User, Smile, Flag, Award, Lock, Edit3, X, Check } from 'react-feather';
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
  const [confirmLogout, setConfirmLogout] = useState(false)
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

  function handleSelected(select, value) {  // Select editor
    switch (select) {
      case "username":
        return setSelected((selected) => ({...selected, username: value}))
      case "fullname":
        return setSelected((selected) => ({...selected, fullname: value}))
      case "password":
        return setSelected((selected) => ({...selected, password: value}))
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
    <div className="UserPage">
      <div className="Main">
        {!selected.username ?
          <div className="Username1">
            <div className="Input">
              <User/>
              <p>{user.username}</p>
            </div>
            <div className="Input">
              <Edit3 onClick={() => handleSelected("username", true)}/>
            </div>
          </div>
        :
          <div className="Username2">
            <Username
              output={handleChange}
              username={newUsername}
              dupliValue={alreadyUsedUN}
              valid={(value) => setCheck(check => ({...check, username:value}))}/>
            <button onClick={() => handleSelected("username", false)}><X/></button>
            <button onClick={() => SubmitEditUsername()} disabled={check.username ? false : true}><Check/></button>
          </div>
        }
        {!selected.fullname ?
          <div className="Fullname1">
            <div className="Input">
              <Smile/>
              <p>{user.fullname}</p>
            </div>
            <div className="Input">
              <Edit3 onClick={() => handleSelected("fullname", true)}/>
            </div>
          </div>
        :
          <div className="Fullname2">
            <Fullname
              output={handleChange}
              fullname={newFullname}
              dupliValue={alreadyUsedFN}
              valid={(value) => setCheck(check => ({...check, fullname:value}))}/>
            <button onClick={() => handleSelected("fullname", false)}><X/></button>
            <button onClick={() => SubmitEditFullname()} disabled={check.fullname ? false : true}><Check/></button>
          </div>
        }
        <div className="AssociationStand">
          <div className="Association">
            <Flag/>
            <p title="Association">{user.association}</p>
          </div>
          <div className="Stand">
            <Award/>
            <p title="Estande">{user.stand}</p>
          </div>
        </div>
        {selected.password &&
          <div className="Password">
            <div className="InputPassword">
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
            <div className="PasswordMenu">
              <button onClick={() => handleSelected("password", false)}><X/></button>
              <button onClick={() => PreSubmitEditPassword()} disabled={check.password ? false : true}><Check/></button>
            </div>          
          </div>
        }
      </div>
      <div className="UserMenu">
        {!selected.password &&
        <button onClick={() => handleSelected("password", true)}>
          Alterar Senha <Edit3/>
        </button>
        }
        {!confirmLogout ?
        <button onClick={() => setConfirmLogout(true)}>
          Logout
        </button>
        :
        <div className="LogoutConfirm">
          <p>Logout</p>
          <button  onClick={() => setConfirmLogout(false)}>
            <X/>
          </button>
          <button onClick={() => SubmitLogout()}>
            <Check/>
          </button>
        </div>
        }
      </div>  
    </div>
  )
}

export default UserPage