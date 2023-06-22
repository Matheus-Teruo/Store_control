import React, { useState, useEffect, useContext } from 'react'
import AuthContext from '../../../store/auth_context';

function StandID(prop) {
  const [standIndex, setStandIndex] = useState(0)
  const [kenjinkaiIndex, setKenjinkaiIndex] = useState(0)
  const [stand, setStand] = useState([])
  const [kenjinkais, setKenjinkais] = useState([])
  const auth = useContext(AuthContext);
  
  useEffect(() => {  // Take user initial value
    var resStatus;
    console.log("ué")
    if (auth.user.authenticated) {
      var resStatus;
      fetch('/api/liststand')
        .then(res => {
          resStatus = res.status;
          return res.json()})
        .then(data => {
          if (resStatus === 200){
            setKenjinkais(data);
            let kIndex = null;
            let sIndex = null;

            for (let i = 0; i < data.length; i++) {
              const kenjinkai = data[i];
              kIndex = i;
              const stands = kenjinkai.stands;
              for (let j = 0; j < stands.length; j++) {
                const stand = stands[j];
                if (stand.ID === 0) { /////DEUTALT VALUE
                  sIndex = j;
                  break;
                }
              }
            }
          }
          // setStand(data[0].stands);
        })
    }
  }, [])

  // useEffect(() => {  // Set default value
  //   setFullname(prop.defaultValue || "")
  //   if (prop.defaultValue){
  //     // setFN_Check(FN_Check => ({...FN_Check, haveMinChar: true}))
  //   }
  // }, [prop.defaultValue])

  return (
    <div>
      <label htmlFor="kenjinkai">Estande</label>
        <select id="kenjinkai" name="observation">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
        <select id="observation" name="observation">
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
    </div>
  )
}

export default StandID