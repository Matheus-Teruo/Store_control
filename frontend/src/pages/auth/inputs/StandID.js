import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../../../store/auth_context';

function StandID(props) {
  const [standIndex, setStandIndex] = useState(0)
  const [associationIndex, setAssociationIndex] = useState(0)
  const [stands, setStands] = useState([])
  const [associations, setAssociations] = useState([])
  const auth = useContext(AuthContext);
  
  useEffect(() => {  // Take user initial value
    var resStatus;
    if (auth.user.authenticated) {
      var resStatus;
      fetch('/api/liststand')
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            setAssociations(data.associations);
            setStands(data.stands);
            if (props.defaultValue !== null){
              setAssociationIndex(data.stands.filter(item => item.standID === props.defaultValue)[0].associationID)
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

  function handleAssociationChange(event) {
    props.output(0);
    setStandIndex(0);
    setAssociationIndex(parseInt(event.target.value))
  }

  return (
    <div>
      <label htmlFor="association">Estande</label>
      <select value={associationIndex} onChange={handleAssociationChange} id="association" name="association">
        <option value={0}></option>
        {associations.map((association) => (
          <option key={association.associationID} value={association.associationID}>{association.association}</option>
        ))}
      </select>
      <select value={standIndex} onChange={handleStandChange} id="stand" name="stand">
        <option value={0}></option>
        {stands.filter(item => item.associationID === associationIndex).map((stand) => (
          <option key={stand.standID} value={stand.standID}>{stand.stand}</option>
        ))}
      </select>
    </div>
  )
}

export default StandID