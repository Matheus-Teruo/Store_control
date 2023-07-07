import React, { useState, useEffect } from 'react'

function StandID(props) {
  const [standIndex, setStandIndex] = useState(0)
  const [associationIndex, setAssociationIndex] = useState(0)
  const [stands, setStands] = useState([])
  const [associations, setAssociations] = useState([])
  
  useEffect(() => {  // Set default value of associationID
    setStandIndex(props.defaultValue || 0)
    setStands(props.stands)
    setAssociations(props.associations)
    setAssociationIndex(props.stands.filter(element => element.standID === props.defaultValue)[0]?.associationID)
  }, [props.defaultValue, props.stands, props.association])

  function handleStandChange(event) {  // handle stand
    props.output(event.target.value);
    setStandIndex(event.target.value)
    if (parseInt(event.target.value) <= 1){
      props.valid(false)
    } else {
      props.valid(true)
    }
  }

  function handleAssociationChange(event) {  // handle association
    props.output(0);
    props.valid(false)
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