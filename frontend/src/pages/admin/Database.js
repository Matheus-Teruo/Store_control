import React, { useState, useEffect, useContext } from 'react'
import { useNavigate  } from 'react-router-dom';
import AuthContext from '../../store/auth_context';
import Kenjinkai from './inputs/Kenjinkai';

function Database() {
  const [kenjinkais, setKenjinkais] = useState([])
  const [stands, setStands] = useState([])
  const [showKenjinkai, setShowKenjinkai] = useState(false)
  const [newKenjinkai, setNewKenjinkai] = useState("")
  const [newPrincipal, setNewPrincipal] = useState("")
  const [check, setCheck] = useState({
    kenjinkai: false,
    observation: false})
  const [alreadyUsedK, setAlreadyUsedK] = useState({kenjinkai: "", K_noUsed: true});
  const [showStand, setShowStand] = useState(false)
  const [observation, setObservation] = useState("")
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

function h_KChange(value) {  // Username conditions
  setNewKenjinkai(value)
};
function h_PChange(value) {  // Fullname conditions
  setNewPrincipal(value);
};
function h_KValid(value) {
  setCheck(check => ({...check, kenjinkai:value}))
};

  return (
    <div>
      {!showKenjinkai?
      <div>
        <button onClick={() => {setShowKenjinkai(true)}}>Novo Kenjinkai</button>
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
      <ul>
        <li><p>kenjinkaiID</p><p>kenjinkai</p><p>diretoria</p><p>stands</p></li>
        {kenjinkais.length !== 0 && kenjinkais.map((kenjinkai) => (
          <li key={kenjinkai.kenjinkaiID}>
            <p>{kenjinkai.kenjinkaiID}</p>
            <p>{kenjinkai.kenjinkai}</p>
            <p>{kenjinkai.principal}</p>

          </li>  
        ))}
      </ul>
      <ul>
        <li><p>observaiton</p><p>kenjinkaiID</p></li>
        {stands.length !== 0 && stands.map((stand) => (
          <li><p>{stand.observaiton}</p><p>{stand.kenjinkaiID}</p></li>
        ))}
      </ul>
      {showStand &&
        <div>
          window for create stand
        </div>
      }
    </div>
  )
}
// && kenjinkais.map((kenjinkai) => {
// <p>{kenjinkai.kenjinkaiID}</p>
// <p>{kenjinkai.kenjinkai}</p>
// <p>{kenjinkai.principal}</p>

export default Database