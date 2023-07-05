import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth_context';
import Association from './inputs/Association';
import Stands from './inputs/Stands';

function Database() {
  const [associations, setAssociations] = useState([])
  const [stands, setStands] = useState([])
  const [showAssociation, setShowAssociation] = useState(false)
  const [newAssociation, setNewAssociation] = useState("")
  const [newPrincipal, setNewPrincipal] = useState("")
  const [alreadyUsedK, setAlreadyUsedK] = useState("");
  const [showStand, setShowStand] = useState(false)
  const [newStand, setNewStand] = useState("")
  const [newAssociationID, setNewAssociationID] = useState(0)
  const [alreadyUsedS, setAlreadyUsedS] = useState("");
  const [check, setCheck] = useState({
    association: false,
    stand: false})
  const [standID, setStandID] = useState(0)
  const [edit, setEdit] = useState("")
  const [confirmDel, setConfirmDel] = useState(false)
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {  // Page requirements
    if (auth.user.authenticated === true && auth.user.superuser) {
      RequestLists()
    } else if (auth.user.authenticated === false) {
      navigate('/login');
    } else if (auth.user.superuser === true && !auth.user.superuser){
      navigate('/')
    }
  }, [auth, navigate])

  async function RequestLists() {  // List all stand and associations
    var resStatus;
      fetch('/api/liststands')
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            setStands(data.stands)
            return setAssociations(data.associations)
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
  }
    
  async function SubmitNewAssociation() {  // Submit new association
    if (auth.user.authenticated) {
      var resStatus;
      fetch("/api/newassociation", {  // Post form
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "association": newAssociation,
          "principal": newPrincipal
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200) {
            RequestLists()
            setNewAssociation(""); setNewPrincipal("");
            setShowAssociation(false); setAlreadyUsedK("")
            setCheck(check => ({...check, association:false}))
          } else if (resStatus === 409) {
            setAlreadyUsedK(data.value);
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch(console.error)
    }
  }

  async function SubmitEditAssociation() {  // Submite edit association
    if (auth.user.authenticated) {
      var resStatus;
      fetch("/api/editassociation", {  // Post form
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "associationID": newAssociationID,
          "association": newAssociation,
          "principal": newPrincipal
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200) {
            RequestLists()
            setNewAssociation(""); setNewPrincipal("");
            setShowAssociation(false); setAlreadyUsedK(""); setEdit("");
            setCheck(check => ({...check, association:false}))  
          } else if (resStatus === 409) {
            setAlreadyUsedK({association: data.value, K_noUsed: false});
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch(console.error)
    }
  }

  async function SubmitDelAssociation() {  // Submit delete association
    if (auth.user.authenticated) {
      var resStatus;
      fetch("/api/delassociation", {  // Post form
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"associationID": newAssociationID,})
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            RequestLists()
            setNewAssociation(""); setNewPrincipal("");
            setShowAssociation(false); setAlreadyUsedK(""); setEdit(""); setConfirmDel(false);
            setCheck(check => ({...check, association:false}))
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch(console.error)
    }
  }

  async function SubmitNewStand() {  // Submit new stand
    if (auth.user.authenticated) {
      var resStatus;
      fetch("/api/newstand", {  // Post form
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "stand": newStand,
          "associationID": newAssociationID
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            RequestLists()
            setNewStand(""); setNewAssociationID(0);
            setShowStand(false); setAlreadyUsedS(false)
            setCheck(check => ({...check, stand:false}))
          } else if (resStatus === 409) {
            setAlreadyUsedS(data.value);
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch(console.error)
    }
  }

  async function SubmitEditStand() {  // Submit edit stand
    if (auth.user.authenticated) {
      var resStatus;
      fetch("/api/editstand", {  // Post form
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "standID": standID,
          "stand": newStand,
          "associationID": newAssociationID
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            RequestLists()
            setNewStand(""); setNewAssociationID(0);
            setShowStand(false); setAlreadyUsedS(false); setEdit("");
            setCheck(check => ({...check, stand:false}))
          } else if (resStatus === 409) {
            setAlreadyUsedS(data.value);
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch(console.error)
    }
  }

  async function SubmitDelStand() {  // Submit delete stand
    if (auth.user.authenticated) {
      var resStatus;
      fetch("/api/delstand", {  // Post form
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"standID": standID})
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200) {
            RequestLists()
            setNewStand(""); setNewAssociationID(0);
            setShowStand(false); setAlreadyUsedS(false); setEdit(""); setConfirmDel(false);
            setCheck(check => ({...check, stand:false}))
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch(console.error)
    }
  }

  function handleKChange(event) {  // Association conditions
    if (event.target.id === "association"){  // Name
      setNewAssociation(event.target.value);
    } else if (event.target.id === "principal"){  // Principal
      setNewPrincipal(event.target.value);
    }
  };

  function handleSChange(event) {  // Stand conditions
    if (event.target.id === "stand") {
      setNewStand(event.target.value);
    } else if (event.target.id === "associationID") {
      setNewAssociationID(parseInt(event.target.value));
    }
  };

  return (
    <div>
      <h1>Associações e estandes</h1>
      <div>
        <h2>Menu</h2>
        <div>
          <button onClick={() => {setShowAssociation(true); setEdit("")}}>Registrar Associação</button>
        </div>
        <div>
          <button onClick={() => {setShowStand(true); setEdit("")}}>Novo Estande</button>
        </div>
      </div>
      <ul>
        <li><p>associaçãoID</p><p>associação</p><p>diretoria</p><p>stands</p></li>
        {associations.length !== 0 && associations.map((association) => (
          <li key={association.associationID}>
            <p>{association.associationID}</p>
            <p onClick={() => {
              setNewAssociationID(association.associationID); 
              setEdit("association"); 
              setShowAssociation(true);
              setNewAssociation(association.association);
              setNewPrincipal(association.principal)}}
            >{association.association}</p>
            <p>{association.principal}</p>
            {stands.filter(item => item.associationID === association.associationID).length !== 0 ?
              <ul>
                {stands.filter(item => item.associationID === association.associationID).map((stand) => (
                  <li key={stand.standID} onClick={() => {
                    setStandID(stand.standID); 
                    setNewStand(stand.stand)
                    setEdit("stand"); 
                    setShowStand(true); 
                    setNewAssociationID(association.associationID)}}
                  >{stand.stand}</li>
                ))}
              </ul>
              :
              <button onClick={() => {setNewAssociationID(association.associationID); setShowStand(true)}}>Criar estande</button>
            }       
          </li>  
        ))}
      </ul>
      {showAssociation &&
      <div>
        <div>
          {edit === "association" &&
          <div>
            <h1>Editar kenjinkai:</h1>
            <h2>{associations.filter(item => item.associationID === newAssociationID)[0].association}</h2>
          </div>
          }
          <Association
            output={handleKChange}
            association={newAssociation}
            principal={newPrincipal}
            dupliValue={alreadyUsedK}
            valid={(value) => setCheck(check => ({...check, association:value}))}/>
          {edit === "association" ?
            <div>
              <button onClick={() => (setConfirmDel(true))}>Excluir kenjinkai</button>
              <button onClick={() => (SubmitEditAssociation())} disabled={check.association ? false : true}>Editar kenjinkai</button>
            </div>
          :
            <div>
              <button onClick={() => {SubmitNewAssociation()}} disabled={check.association ? false : true}>Registrar</button>
            </div>
          }
        </div>
      </div>
      }
      {showStand &&
      <div>
        <div>
          {edit === "stand" &&
            <div>
              <h1>Editar estande:</h1>
              <h2>{stands.filter(item => item.standID === standID)[0].stand}</h2>
            </div>
          }
          <Stands
            output={handleSChange}
            stand={newStand}
            associationID={newAssociationID}
            associations={associations}
            dupliValue={alreadyUsedS}
            valid={(value) => setCheck(check => ({...check, stand:value}))}/>
          {edit === "stand" ?
            <div>
              <button onClick={() => (setConfirmDel(true))}>Excluir Estande</button>
              <button onClick={() => (SubmitEditStand())} disabled={check.stand ? false : true}>Editar Estande</button>
            </div>
          :
            <div>
              <button onClick={() => (SubmitNewStand())} disabled={check.stand ? false : true}>Criar Estande</button>
            </div>
          }
        </div>
      </div>
      }
      {confirmDel &&
      <div>
        <div>
          <h2>Excluir: {edit === "association" ?
          <>kenjinkai {associations.filter(item => item.associationID === newAssociationID)[0].association}</>
          :
          edit === "stand" &&
          <>estande {stands.filter(item => item.standID === standID)[0].stand}</>}</h2>
          <div>
            <button onClick={() => (setConfirmDel(false))}>Cancelar</button>
            {edit === "association" ?
            <button onClick={() => (SubmitDelAssociation())}>Excluir kenjinkai</button>
            :
            edit === "stand" &&
            <button onClick={() => (SubmitDelStand())}>Excluir Estande</button>
            }
          </div>
        </div>
      </div>
      }
    </div>
  )
}

export default Database