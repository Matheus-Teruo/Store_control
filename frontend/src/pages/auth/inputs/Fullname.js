import React, { useState, useEffect } from 'react'

const regexnumber = /[0-9]/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Fullname(props) {
  const [Check, setCheck] = useState({
    haveMinChar: false,
    noNumber: true,
    noSpecialChar: true});
  const [submitvalid, setSubmitvalid] = useState(false);

  useEffect(() => {  // Check all conditions
    if (Check.haveMinChar &&
        Check.noNumber &&
        Check.noSpecialChar &&
        props.dupliValue !== props.fullname){
      setSubmitvalid(true);
      props.valid(true)
    } else {
      setSubmitvalid(false);
      props.valid(false)
    }
  }, [Check, props.fullname, props.dupliValue])

  useEffect(() => {
    if (props.fullname.trim().length >= 6) {  // Check min number of char
      setCheck(Check => ({...Check, haveMinChar: true})
    )} else {
      setCheck(Check => ({...Check, haveMinChar: false})
    )}

    if (!regexnumber.test(props.fullname)) {  // Check use of number
      setCheck(Check => ({...Check, noNumber: true})
    )} else {
      setCheck(Check => ({...Check, noNumber: false})
    )};

    if (!regexspecial.test(props.fullname)) {  // Check use of special char
      setCheck(Check => ({...Check, noSpecialChar: true})
    )} else {
      setCheck(Check => ({...Check, noSpecialChar: false})
    )};
  }, [props.fullname])
  

  return (
    <div>
      <label htmlFor="fullname">Nome Completo:</label>
      <input value={props.fullname} onChange={event => props.output(event)} id="fullname" type="text" name="fullname" />
      <div>
        {!Check.haveMinChar && <div>minChar</div>}
        {!Check.noNumber && <div>noNumber</div>}
        {!Check.noSpecialChar && <div>noCharEspecial</div>}
        {props.dupliValue !== "" && (props.dupliValue === props.fullname) && <div>noUsed</div>}
      </div>
    </div>
  )
}

export default Fullname