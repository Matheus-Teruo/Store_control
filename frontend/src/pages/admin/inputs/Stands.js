import React, { useState, useEffect } from 'react'

const regexnumber = /[0-9]/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Stands(props) {
  const [Check, setCheck] = useState({
    haveMinChar: false,
    noNumber: true,
    noSpecialChar: true});
  const [submitvalid, setSubmitvalid] = useState(false);

  useEffect(() => {  // Check all conditions
    if (Check.haveMinChar &&
        Check.noNumber &&
        Check.noSpecialChar &&
        props.kenjinkaiID !== 0 &&
        props.dupliValue !== props.stand){
      setSubmitvalid(true);
      props.valid(true)
    } else {
      setSubmitvalid(false);
      props.valid(false)
    }
  }, [Check, props.stand, props.kenjinkaiID, props.dupliValue])

  useEffect(() => {  // Stand conditions
    if (props.stand.trim().length > 2) {  // Check min number of char
      setCheck(Check => ({...Check, haveMinChar: true})
    )} else {
      setCheck(Check => ({...Check, haveMinChar: false})
    )};

    if (!regexnumber.test(props.stand)) {  // Check use of number
      setCheck(Check => ({...Check, noNumber: true})
    )} else {
      setCheck(Check => ({...Check, noNumber: false})
    )};

    if (!regexspecial.test(props.stand)) {  // Check use of special char
      setCheck(Check => ({...Check, noSpecialChar: true})
    )} else {
      setCheck(Check => ({...Check, noSpecialChar: false})
    )};
  }, [props.stand])

  return (
    <div>
      <label>Estande:</label>
      <input value={props.stand} onChange={event => props.output(event)} id="stand" type="text" name="stand"/>
      <div>
        {!Check.haveMinChar && <div>minChar</div>}
        {!Check.noNumber && <div>nonumber</div>}
        {!Check.noSpecialChar && <div>noSpecialChar</div>}
        {props.dupliValue !== "" && (props.dupliValue === props.stand) && <div>noUsed</div>}
      </div>
      <label htmlFor="kenjinkai">Kenjinkai</label>
      <select value={props.kenjinkaiID} onChange={event => props.output(event)} id="kenjinkaiID" name="kenjinkaiID">
        <option value={0}></option>
        {props.kenjinkais.map((kenjinkai) => (
          <option key={kenjinkai.kenjinkaiID} value={kenjinkai.kenjinkaiID}>{kenjinkai.kenjinkai}</option>
        ))}
      </select>
    </div>
  )
}

export default Stands