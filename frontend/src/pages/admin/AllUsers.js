import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth_context';
import StandID from '../auth/inputs/StandID';

function AllUsers() {
  const [users, setUsers] = useState([])
  const [selectedUserID, setSelectedUserID] = useState(0)
  const [associations, setAssociations] = useState([])
  const [stands, setStands] = useState([])
  const [newStandID, setNewStandID] = useState(null);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {  // Load from pages
    if (auth.user.authenticated === true && auth.user.superuser) {
      RequestLists()
      RequestStands()
    } else if (auth.user.authenticated === false) {
      navigate('/login');
    } else if (auth.user.authenticated === true && !auth.user.superuser){
      navigate('/')
    }
  }, [auth, navigate])

  async function RequestLists() {  // List all Users
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

  async function RequestStands() {
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

  async function SubmitChangeStand(){
    var resStatus;
    fetch("/api/changestandid", {  // Pre login get salt
      method: "POST", headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"standID": newStandID})
    })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200) {
          setSelectedUserID(0);
          return RequestLists();
        } else if (resStatus === 401){
          return auth.onLogout()
        }
      })
      .catch(console.error)
  }

  function h_SChange(value) {  // Manage stand ID
    const aux = parseInt(value)
    if (aux === 0) {
      setNewStandID(null)
    } else {
      setNewStandID(aux)
    }
  }

  return (
    <div>
      <h1>Usuários</h1>
      <div>
        <h2>Menu</h2>
        <div>
          <h3>filtro</h3>
          {/* <select value={filter} onChange={event => setFilter(event.target.value)} id="filter" name="filter">
            <option value={0}>Todos</option>
            <option value={1}>Cartões vazios</option>
            <option value={2}>Com crédito</option>
          </select> */}
        </div>
      </div>
      <div>
        <ul>
          <li><p>ID do Usuário</p><p>Usuário</p><p>Nome Completo</p><p>standID</p><p>Superuser</p></li>
          {users.length !== 0 &&
          users
          // .filter(user => {
          //   if (filter === "1"){
          //     return user.debit === 0;
          //   } else if (filter === "2") {
          //     return user.debit !== 0;
          //   } else {
          //     return true
          //   }
          // })
          .map((user) => (
            <li key={user.userID}>
              <p>{user.userID}</p>
              <p>{user.username}</p>
              <p>{user.fullname}</p>  
              {selectedUserID !== user.userID?
              <>
                <p onClick={() => setSelectedUserID(user.userID)}>Estande</p>
                <p>{associations.filter(association => association.associationID === user.associationID)[0]?.association}</p>
                <p>{stands.filter(element => element.standID === user.standID)[0]?.stand}</p>
              </>
              :
              <p>
                <StandID
                  output={h_SChange}
                  associations={associations}
                  stands={stands}
                  defaultValue={user.standID}/>
                <button onClick={() => (SubmitChangeStand())}>Confirmar</button>
              </p>
              }
              <p>{user.superuser}</p>
            </li>  
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AllUsers