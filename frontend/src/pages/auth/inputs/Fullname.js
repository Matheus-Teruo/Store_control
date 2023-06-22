import React, { useState, useEffect } from 'react'

const regexnumber = /[0-9]/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Fullname(prop) {
  const [fullname, setFullname] = useState("");
  const [Check, setCheck] = useState({
    haveMinChar: false,
    noNumber: true,
    noSpecialChar: true});
  const [submitvalid, setSubmitvalid] = useState(false);

  useEffect(() => {  // Check all conditions
    if (Check.haveMinChar &&
        Check.noNumber &&
        Check.noSpecialChar &&
        prop.defaultValue !== fullname &&
        prop.dupliValue !== fullname){
      setSubmitvalid(true);
      prop.valid(true)
    } else {
      setSubmitvalid(false);
      prop.valid(false)
    }
  }, [Check, fullname, prop.dupliValue, prop.defaultValue])

  useEffect(() => {  // Set default value
    setFullname(prop.defaultValue || "")
    if (prop.defaultValue){
      setCheck(Check => ({...Check, haveMinChar: true}))
    }
  }, [prop.defaultValue])

  const handleFullnameChange = (event) => {  // Fullname conditions
    setFullname(event.target.value);
    prop.output(event.target.value);

    if (event.target.value.trim().length >= 6) {  // Check min number of char
      setCheck(Check => ({...Check, haveMinChar: true})
    )} else {
      setCheck(Check => ({...Check, haveMinChar: false})
    )}

    if (!regexnumber.test(event.target.value)) {  // Check use of number
      setCheck(Check => ({...Check, noSpecialChar: true})
    )} else {
      setCheck(Check => ({...Check, noSpecialChar: false})
    )};

    if (!regexspecial.test(event.target.value)) {  // Check use of special char
      setCheck(Check => ({...Check, noSpecialChar: true})
    )} else {
      setCheck(Check => ({...Check, noSpecialChar: false})
    )};
  };

  return (
    <div>
      <label htmlFor="fullname">Nome Completo:</label>
      <input value={fullname} onChange={handleFullnameChange} id="fullname" type="text" name="fullname" />
      {!Check.haveMinChar && <div>minChar</div>}
      {!Check.noSpecialChar && <div>noCharEspecial</div>}
      {!prop.dupliCheck && (prop.dupliValue === fullname) && <div>noUsed</div>}
      <div>{prop.dupliValue}</div>
    </div>
  )
}

export default Fullname