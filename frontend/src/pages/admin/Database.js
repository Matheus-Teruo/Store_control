import React, { useState, useEffect, useContext } from 'react'
import { useNavigate  } from 'react-router-dom';
import AuthContext from '../../store/auth_context';
import Kenjinkai from './inputs/Kenjinkai';
import Stands from './inputs/Stands';

function Database() {
  const [kenjinkais, setKenjinkais] = useState([])
  const [stands, setStands] = useState([])
  const [showKenjinkai, setShowKenjinkai] = useState(false)
  const [newKenjinkai, setNewKenjinkai] = useState("")
  const [newPrincipal, setNewPrincipal] = useState("")
  const [alreadyUsedK, setAlreadyUsedK] = useState("");
  const [showStand, setShowStand] = useState(false)
  const [newStand, setNewStand] = useState("")
  const [newKenjinkaiID, setNewKenjinkaiID] = useState(0)
  const [alreadyUsedS, setAlreadyUsedS] = useState("");
  const [check, setCheck] = useState({
    kenjinkai: false,
    stand: false})
  const [standID, setStandID] = useState(0)
  const [edit, setEdit] = useState("")
  const [confirmDel, setConfirmDel] = useState(false)
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {  // Load from pages
    console.log(auth.user)
    if (auth.user.authenticated === true && auth.user.superuser) {
      RequestLists()
    } else if (auth.user.authenticated === false) {
      navigate('/login');
    } else if (auth.user.superuser === true && !auth.user.superuser){
      navigate('/')
    }
  }, [auth, navigate])

async function RequestLists() {  // List all stand and kenjinkais
  var resStatus;
    fetch('/api/listallstands')
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200){
          setStands(data.stands)
          return setKenjinkais(data.kenjinkais)
        } else if (resStatus === 401){
          return auth.onLogout()
        }
      })
}
  
async function handleNewKenjinkai() {
  if (auth.user.authenticated) {
    var resStatus;
    fetch("/api/newkenjinkai", {  // Post form
      method: "POST", headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "kenjinkai": newKenjinkai,
        "principal": newPrincipal
      })
    })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200) {
          RequestLists()
          setShowKenjinkai(false)
          setCheck(check => ({...check, kenjinkai:false}))
        } else if (resStatus === 409) {
          setAlreadyUsedK(data.value);
        }
      })
      .catch(console.error)
  }
}

async function handleEditKenjinkai() {
  if (auth.user.authenticated) {
    var resStatus;
    fetch("/api/editkenjinkai", {  // Post form
      method: "POST", headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "kenjinkaiID": newKenjinkaiID,
        "kenjinkai": newKenjinkai,
        "principal": newPrincipal
      })
    })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200) {
          RequestLists()
          setShowKenjinkai(false); setEdit("");
          setCheck(check => ({...check, kenjinkai:false}))  
        } else if (resStatus === 409) {
          setAlreadyUsedK({kenjinkai: data.value, K_noUsed: false});
        }
      })
      .catch(console.error)
  }
}

async function handleDelKenjinkai() {
  if (auth.user.authenticated) {
    var resStatus;
    fetch("/api/delkenjinkai", {  // Post form
      method: "POST", headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"kenjinkaiID": newKenjinkaiID,})
    })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        RequestLists()
        setShowKenjinkai(false); setEdit(""); setConfirmDel(false);
        setCheck(check => ({...check, kenjinkai:false}))
      })
      .catch(console.error)
  }
}

async function handleNewStand() {
  if (auth.user.authenticated) {
    var resStatus;
    fetch("/api/newstand", {  // Post form
      method: "POST", headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "stand": newStand,
        "kenjinkaiID": newKenjinkaiID
      })
    })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200){
          RequestLists()
          setShowStand(false)
          setCheck(check => ({...check, stand:false}))
        } else if (resStatus === 409) {
          setAlreadyUsedS(data.value);
        }
      })
      .catch(console.error)
  }
}

async function handleEditStand() {
  if (auth.user.authenticated) {
    var resStatus;
    fetch("/api/editstand", {  // Post form
      method: "POST", headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "standID": standID,
        "stand": newStand,
        "kenjinkaiID": newKenjinkaiID
      })
    })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200){
          RequestLists()
          setShowStand(false); setEdit("");
          setCheck(check => ({...check, stand:false}))
        } else if (resStatus === 409) {
          setAlreadyUsedS(data.value);
        }
      })
      .catch(console.error)
  }
}

async function handleDelStand() {
  if (auth.user.authenticated) {
    var resStatus;
    fetch("/api/delstand", {  // Post form
      method: "POST", headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"standID": standID})
    })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
          RequestLists()
          setShowStand(false); setEdit(""); setConfirmDel(false);
          setCheck(check => ({...check, stand:false}))
      })
      .catch(console.error)
  }
}

function h_KChange(event) {  // Kenjinkai conditions
  if (event.target.id === "kenjinkai"){  // Name
    setNewKenjinkai(event.target.value);
  } else if (event.target.id === "principal"){  // Principal
    setNewPrincipal(event.target.value);
  }
};
function h_KValid(value) {  // Kenjinkai valid
  setCheck(check => ({...check, kenjinkai:value}))
};

function h_SChange(event) {  // Stand conditions
  if (event.target.id === "stand") {
    setNewStand(event.target.value);
  } else if (event.target.id === "kenjinkaiID") {
    setNewKenjinkaiID(parseInt(event.target.value));
  }
};
function h_SValid(value) {  // Stand valid
  setCheck(check => ({...check, stand:value}))
};

  return (
    <div>
      <h1>Kenjinkais e estandes</h1>
      <div>
        <h2>Menu</h2>
        <div>
          <button onClick={() => {setShowKenjinkai(true)}}>Registrar kenjinkai</button>
        </div>
        <div>
          <button onClick={() => {setShowStand(true)}}>Novo estande</button>
        </div>
      </div>
      <ul>
        <li><p>kenjinkaiID</p><p>kenjinkai</p><p>diretoria</p><p>stands</p></li>
        {kenjinkais.length !== 0 && kenjinkais.map((kenjinkai) => (
          <li key={kenjinkai.kenjinkaiID}>
            <p>{kenjinkai.kenjinkaiID}</p>
            <p onClick={() => {setNewKenjinkaiID(kenjinkai.kenjinkaiID); setEdit("kenjinkai"); setShowKenjinkai(true)}}
            >{kenjinkai.kenjinkai}</p>
            <p>{kenjinkai.principal}</p>
            {stands.filter(item => item.kenjinkaiID === kenjinkai.kenjinkaiID).length !== 0 ?
              <ul>
                {stands.filter(item => item.kenjinkaiID === kenjinkai.kenjinkaiID).map((stand) => (
                  <li key={stand.standID} onClick={() => {setStandID(stand.standID); setEdit("stand"); setShowStand(true); setNewKenjinkaiID(kenjinkai.kenjinkaiID)}}>{stand.stand}</li>
                ))}
              </ul>
              :
              <button onClick={() => {setNewKenjinkaiID(kenjinkai.kenjinkaiID); setShowStand(true)}}>Criar estande</button>
            }       
          </li>  
        ))}
      </ul>
      {showKenjinkai &&
      <div>
        <div>
          {edit === "kenjinkai" &&
          <div>
            <h1>Editar kenjinkai:</h1>
            <h2>{kenjinkais.filter(item => item.kenjinkaiID === newKenjinkaiID)[0].kenjinkai}</h2>
          </div>
          }
          <Kenjinkai
            output={h_KChange}
            kenjinkai={newKenjinkai}
            principal={newPrincipal}
            dupliValue={alreadyUsedK}
            valid={h_KValid}/>
          {edit === "kenjinkai" ?
            <div>
              <button onClick={() => (setConfirmDel(true))}>Excluir Kenjinkai</button>
              <button onClick={() => (handleEditKenjinkai())} disabled={check.kenjinkai ? false : true}>Editar Kenjinkai</button>
            </div>
          :
            <div>
              <button onClick={() => {handleNewKenjinkai()}} disabled={check.kenjinkai ? false : true}>Registrar</button>
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
            output={h_SChange}
            stand={newStand}
            kenjinkaiID={newKenjinkaiID}
            kenjinkais={kenjinkais}
            dupliValue={alreadyUsedS}
            valid={h_SValid}/>
          {edit === "stand" ?
            <div>
              <button onClick={() => (setConfirmDel(true))}>Excluir Estande</button>
              <button onClick={() => (handleEditStand())} disabled={check.stand ? false : true}>Editar Estande</button>
            </div>
          :
            <div>
              <button onClick={() => (handleNewStand())} disabled={check.stand ? false : true}>Criar Estande</button>
            </div>
          }
        </div>
      </div>
      }
      {confirmDel &&
      <div>
        <div>
          <h2>Excluir: {edit === "kenjinkai" ?
          <>kenjinkai {kenjinkais.filter(item => item.kenjinkaiID === newKenjinkaiID)[0].kenjinkai}</>
          :
          edit === "stand" &&
          <>estande {stands.filter(item => item.standID === standID)[0].stand}</>}</h2>
          <div>
            <button onClick={() => (setConfirmDel(false))}>Cancelar</button>
            {edit === "kenjinkai" ?
            <button onClick={() => (handleDelKenjinkai())}>Excluir Kenjinkai</button>
            :
            edit === "stand" &&
            <button onClick={() => (handleDelStand())}>Excluir Estande</button>
            }
          </div>
        </div>
      </div>
      }
    </div>
  )
}

export default Database