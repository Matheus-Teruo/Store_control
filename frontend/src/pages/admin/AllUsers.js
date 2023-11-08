import './AllUsers.css'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { User, Key, CheckSquare } from 'react-feather';
import AuthContext from '../../store/auth_context';
import StandID from './inputs/StandID';

function AllUsers() {
  const [users, setUsers] = useState([])
  const [selectedUserID, setSelectedUserID] = useState(0)
  const [associations, setAssociations] = useState([])
  const [stands, setStands] = useState([])
  const [filter, setFilter] = useState(0)
  const [newStandID, setNewStandID] = useState(null);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {  // Page requirements
    if (auth.user.authenticated === true && auth.user.superuser) {
      RequestUsers()
      RequestStands()
    } else if (auth.user.authenticated === false) {
      navigate('/login');
    } else if (auth.user.authenticated === true && !auth.user.superuser){
      navigate('/')
    }
  }, [auth, navigate])

  async function RequestUsers() {  // List all users
    var resStatus;
    fetch('/api/allusers')
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200){
          return setUsers(data)
        } else if (resStatus === 401){
          return auth.onLogout()
        }
      })
  }

  async function RequestStands() {  // List all stands
    var resStatus;
      fetch('/api/liststand')
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            setAssociations(data.associations);
            setStands(data.stands);
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
  }

  async function SubmitEditStandID(){  // Submit edit StandID
    var resStatus;
    fetch("/api/changestandid", {  // Pre login get salt
      method: "POST", headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "standID": newStandID,
        "userID": selectedUserID
      })
    })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200) {
          setSelectedUserID(0);
          return RequestUsers();
        } else if (resStatus === 401){
          return auth.onLogout()
        }
      })
      .catch(console.error)
  }

  function handleChange(value) {  // Manage stand ID
    const aux = parseInt(value)
    if (aux === 0) {
      setNewStandID(null)
    } else {
      setNewStandID(aux)
    }
  }

  return (
    <div className="AllUsers">
      <div className="Menu">
        <h2>Usuários</h2>
        <div className="Filter">
          <h3>Filtro</h3>
          <select value={filter} onChange={event => setFilter(parseInt(event.target.value))} id="filter" name="filter">
            <option value={0}>Todos</option>
            {stands.map((stand) => (
              <option key={stand.standID} value={stand.standID}>{stand.stand}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="Main">
        <ul>
          <li id="header"><p id="userID">ID</p><p id="username">Usuário</p><p id="fullname">Nome</p><div className="AStand">Estande</div><p id="superuser">Admin</p></li>
          {users.length !== 0 && users.filter(user => {
            if (filter === 0){
              return true;
            } else {
              return user.standID === filter
            }
          }).map((user) => (
            <li key={user.userID}>
              <p id="userID">{user.userID}</p>
              <p id="username">{user.username}</p>
              <p id="fullname">{user.fullname}</p>  
              {selectedUserID !== user.userID?
              <div className="AStand" onClick={() => setSelectedUserID(user.userID)}>
                <p id="association">{associations.filter(association => association.associationID === user.associationID)[0]?.association}</p>
                <p id="stand">{stands.filter(element => element.standID === user.standID)[0]?.stand}</p>
              </div>
              :
              <div className="AStand">
                <StandID
                  output={handleChange}
                  associations={associations}
                  stands={stands}
                  valid={() => {}}
                  defaultValue={user.standID}
                  noCashier={false}/>
                <button onClick={() => (SubmitEditStandID())}><CheckSquare size={20}/></button>
              </div>
              }
              <p id="superuser">{user.superuser === 1 ? <Key/> : <User/>}</p>
            </li>  
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AllUsers