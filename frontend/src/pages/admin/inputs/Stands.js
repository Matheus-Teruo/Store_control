import React, { useState, useEffect } from 'react'

const regexnumber = /[0-9]/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Stands(prop) {
  const [stand, setStand] = useState("")
  const [kenjinkaiID, setKenjinkaiID] = useState(prop.kenjinkaiID)
  const [Check, setCheck] = useState({
    haveMinChar: false,
    noNumber: true,
    noSpecialChar: true});
  const [submitvalid, setSubmitvalid] = useState(false);

  useEffect(() => {  // Check all conditions
    if (Check.haveMinChar &&
        Check.noNumber &&
        Check.noSpecialChar &&
        kenjinkaiID !== 0 &&
        prop.dupliValue !== stand){
      setSubmitvalid(true);
      prop.valid(true)
    } else {
      setSubmitvalid(false);
      prop.valid(false)
    }
  }, [Check, kenjinkaiID, stand, prop.dupliValue])

  const handleStandChange = (event) => {  // Username conditions
    setStand(event.target.value);
    prop.output(event.target.value);

    if (event.target.value.trim().length > 2) {  // Check min number of char
      setCheck(Check => ({...Check, haveMinChar: true})
    )} else {
      setCheck(Check => ({...Check, haveMinChar: false})
    )};

    if (!regexnumber.test(event.target.value)) {  // Check use of number
      setCheck(Check => ({...Check, noNumber: true})
    )} else {
      setCheck(Check => ({...Check, noNumber: false})
    )};

    if (!regexspecial.test(event.target.value)) {  // Check use of special char
      setCheck(Check => ({...Check, noSpecialChar: true})
    )} else {
      setCheck(Check => ({...Check, noSpecialChar: false})
    )};
  };

  const handleKenjinkaiChange = (event) => {  // Username conditions
    setKenjinkaiID(parseInt(event.target.value));
    prop.outputID(event.target.value);
    console.log()
  }

  return (
    <div>
      <label>Estande:</label>
      <input value={stand} onChange={handleStandChange} id="stand" type="text" name="stand"/>
      {!Check.haveMinChar && <div>minChar</div>}
      {!Check.noNumber && <div>nonumber</div>}
      {!Check.noSpecialChar && <div>noSpecialChar</div>}
      {!prop.dupliCheck && (prop.dupliValue === stand) && <div>noUsed</div>}
      <label htmlFor="kenjinkai">Kenjinkai</label>
      <select onChange={handleKenjinkaiChange} value={kenjinkaiID} id="kenjinkai" name="kenjinkai">
        <option value={0}></option>
        {prop.kenjinkais.map((kenjinkai) => (
          <option key={kenjinkai.kenjinkaiID} value={kenjinkai.kenjinkaiID}>{kenjinkai.kenjinkai}</option>
        ))}
      </select>
    </div>
  )
}

export default Stands