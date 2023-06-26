import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../../../store/auth_context';

function StandID(props) {
  const [standIndex, setStandIndex] = useState(0)
  const [kenjinkaiIndex, setKenjinkaiIndex] = useState(0)
  const [stands, setStands] = useState([])
  const [kenjinkais, setKenjinkais] = useState([])
  const auth = useContext(AuthContext);
  
  useEffect(() => {  // Take user initial value
    var resStatus;
    if (auth.user.authenticated) {
      var resStatus;
      fetch('/api/liststand')
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            setKenjinkais(data.kenjinkais);
            setStands(data.stands);
            if (props.defaultValue !== null){
              setKenjinkaiIndex(data.stands.filter(item => item.standID === props.defaultValue)[0].kenjinkaiID)
            }
          } else {

          }
        })
    }
  }, [auth])

  useEffect(() => {  // Set default value
    setStandIndex(props.defaultValue || 0)
  }, [props.defaultValue])

  function handleStandChange(event) {
    props.output(event.target.value);
    setStandIndex(event.target.value)
  }

  function handleKenjinkaiChange(event) {
    props.output(0);
    setStandIndex(0);
    setKenjinkaiIndex(parseInt(event.target.value))
  }

  return (
    <div>
      <label htmlFor="kenjinkai">Estande</label>
      <select value={kenjinkaiIndex} onChange={handleKenjinkaiChange} id="kenjinkai" name="kenjinkai">
        <option value={0}></option>
        {kenjinkais.map((kenjinkai) => (
          <option key={kenjinkai.kenjinkaiID} value={kenjinkai.kenjinkaiID}>{kenjinkai.kenjinkai}</option>
        ))}
      </select>
      <select value={standIndex} onChange={handleStandChange} id="stand" name="stand">
        <option value={0}></option>
        {stands.filter(item => item.kenjinkaiID === kenjinkaiIndex).map((stand) => (
          <option key={stand.standID} value={stand.standID}>{stand.stand}</option>
        ))}
      </select>
    </div>
  )
}

export default StandID