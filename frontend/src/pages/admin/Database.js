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
  const [alreadyUsedK, setAlreadyUsedK] = useState({kenjinkai: "", K_noUsed: true});
  const [showStand, setShowStand] = useState(false)
  const [newStand, setNewStand] = useState("")
  const [kenjinkaiID, setKenjinkaiID] = useState(1)
  const [alreadyUsedS, setAlreadyUsedS] = useState({stand: "", S_noUsed: true});
  const [check, setCheck] = useState({
    kenjinkai: false,
    stand: false})
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user.authenticated) {
      RequestLists()
    } else if (!auth.user.authenticated) {
      navigate('/login');
    }
  }, [])

async function RequestLists() {
  var resStatus;
    fetch('/api/listallstands')
      .then(res => {
        resStatus = res.status;
        return res.json()})
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
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "kenjinkai": newKenjinkai,
        "principal": newPrincipal
      })
    })
      .then(res => {
        resStatus = res.status;
        return res.json()})
      .then(data => {
        if (resStatus === 200) {
          RequestLists()
          setShowKenjinkai(false)
        } else if (resStatus === 409) {
          setAlreadyUsedK({kenjinkai: data.value, K_noUsed: false});
        }
      })
      .catch(console.error)
  }
}

async function handleNewStand() {
  if (auth.user.authenticated) {
    var resStatus;
    fetch("/api/newstand", {  // Post form
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "stand": newStand,
        "kenjinkaiID": kenjinkaiID
      })
    })
      .then(res => {
        resStatus = res.status;
        return res.json()})
      .then(data => {
        if (resStatus === 200){
          RequestLists()
          setShowStand(false)
        } else if (resStatus === 409) {
          setAlreadyUsedS({stand: data.value, S_noUsed: false});
        }
      })
      .catch(console.error)
  }
}

function h_KChange(value) {  // Username conditions
  setNewKenjinkai(value)
};
function h_PChange(value) {  // Fullname conditions
  setNewPrincipal(value);
};
function h_KValid(value) {
  setCheck(check => ({...check, kenjinkai:value}))
};

function h_SChange(value) {  // Fullname conditions
  setNewStand(value);
};
function h_K_IDChange(value) {  // Fullname conditions
  setKenjinkaiID(value);
};
function h_SValid(value) {
  setCheck(check => ({...check, stand:value}))
};

  return (
    <div>
      <div>
        {!showKenjinkai?
        <div>
          <button onClick={() => {setShowKenjinkai(true)}}>Registrar kenjinkai</button>
        </div>
        :
        <div>
          <Kenjinkai
            output_K={h_KChange}
            output_P={h_PChange}
            valid={h_KValid}
            dupliValue={alreadyUsedK.kenjinkai}
            dupliCheck={alreadyUsedK.K_noUsed}/>
          <button onClick={() => {handleNewKenjinkai()}} disabled={check.kenjinkai ? false : true}>Registrar</button>
        </div>
        }
        {
        <div>
          <button onClick={() => {setShowStand(true)}}>Novo estande</button>
        </div>
        }
      </div>
      <ul>
        <li><p>kenjinkaiID</p><p>kenjinkai</p><p>diretoria</p><p>stands</p></li>
        {kenjinkais.length !== 0 && kenjinkais.map((kenjinkai) => (
          <li key={kenjinkai.kenjinkaiID}>
            <p>{kenjinkai.kenjinkaiID}</p>
            <p>{kenjinkai.kenjinkai}</p>
            <p>{kenjinkai.principal}</p>
            {stands.filter(item => item.kenjinkaiID === kenjinkai.kenjinkaiID).length !== 0 ?
              <ul>
                {stands.filter(item => item.kenjinkaiID === kenjinkai.kenjinkaiID).map((stand) => (
                  <li>{stand.stand}</li>
                ))}
              </ul>
              :
              <button onClick={() => {setKenjinkaiID(kenjinkai.kenjinkaiID); setShowStand(true)}}>Novo estande</button>
            }       
          </li>  
        ))}
      </ul>
      {showStand &&
        <div>
          <Stands
            output={h_SChange}
            outputID={h_K_IDChange}
            valid={h_SValid}
            kenjinkais={kenjinkais}
            kenjinkaiID={kenjinkaiID}
            dupliValue={alreadyUsedS.stand}
            dupliCheck={alreadyUsedS.S_noUsed}/>
          <button onClick={() => (handleNewStand())} disabled={check.stand ? false : true}>Criar Estande</button>
        </div>
      }
    </div>
  )
}

export default Database