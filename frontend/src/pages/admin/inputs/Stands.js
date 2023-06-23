import React, { useState, useEffect } from 'react'

const regexnumber = /[0-9]/
const regexspace = /\s/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Stands(prop) {
  const [stand, setStand] = useState("")
  const [kenjinkaiID, setKenjinkaiID] = useState(prop.kenjinkaiID)
  const [Check, setCheck] = useState({
    haveMinChar: false,
    noNumber: true,
    noSpace: true, 
    noSpecialChar: true});
  const [submitvalid, setSubmitvalid] = useState(false);

  useEffect(() => {  // Check all conditions
    if (Check.haveMinChar &&
        Check.noNumber &&
        Check.noSpace &&
        Check.noSpecialChar &&
        prop.dupliValue !== stand){
      setSubmitvalid(true);
      prop.valid(true)
    } else {
      setSubmitvalid(false);
      prop.valid(false)
    }
  }, [Check, stand, prop.dupliValue])

  const handleStandChange = (event) => {  // Username conditions
    setStand(event.target.value);
    prop.output(event.target.value);

    if (event.target.value.trim().length >= 3) {  // Check min number of char
      setCheck(Check => ({...Check, haveMinChar: true})
    )} else {
      setCheck(Check => ({...Check, haveMinChar: false})
    )};

    if (!regexnumber.test(event.target.value)) {  // Check use of number
      setCheck(Check => ({...Check, noNumber: true})
    )} else {
      setCheck(Check => ({...Check, noNumber: false})
    )};

    if (!regexspace.test(event.target.value)) {  // Check use of space
      setCheck(Check => ({...Check, noSpace: true})
    )} else {
      setCheck(Check => ({...Check, noSpace: false})
    )};

    if (!regexspecial.test(event.target.value)) {  // Check use of special char
      setCheck(Check => ({...Check, noSpecialChar: true})
    )} else {
      setCheck(Check => ({...Check, noSpecialChar: false})
    )};
  };

  const handleKenjinkaiChange = (event) => {  // Username conditions
    setKenjinkaiID(event.target.value);
    prop.outputID(event.target.value);
  }

  return (
    <div>
      <label>Estande:</label>
      <input value={stand} onChange={handleStandChange} id="stand" type="text" name="stand"/>
      {!Check.haveMinChar && <div>minChar</div>}
      {!Check.noNumber && <div>nonumber</div>}
      {!Check.noSpace && <div>noSpace</div>}
      {!Check.noSpecialChar && <div>noSpecialChar</div>}
      {!prop.dupliCheck && (prop.dupliValue === stand) && <div>noUsed</div>}
      <label htmlFor="kenjinkai">Kenjinkai</label>
      <select onChange={handleKenjinkaiChange} value={kenjinkaiID} id="kenjinkai" name="kenjinkai">
        {prop.kenjinkais.map((kenjinkai) => (
          <option key={kenjinkai.kenjinkaiID} value={kenjinkai.kenjinkaiID}>{kenjinkai.kenjinkai}</option>
        ))}
      </select>
    </div>
  )
}

export default Stands