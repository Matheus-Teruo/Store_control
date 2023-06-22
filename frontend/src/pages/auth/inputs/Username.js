import React, { useState, useEffect } from 'react'

const regexspace = /\s/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Username(prop) {
  const [username, setUsername] = useState("");
  const [Check, setCheck] = useState({
    haveMinChar: false,
    noSpace: true, 
    noSpecialChar: true});
  const [submitvalid, setSubmitvalid] = useState(false);

  useEffect(() => {  // Check all conditions
    if (Check.haveMinChar &&
        Check.noSpace &&
        Check.noSpecialChar &&
        prop.defaultValue !== username &&
        prop.dupliValue !== username){
      setSubmitvalid(true);
      prop.valid(true)
    } else {
      setSubmitvalid(false);
      prop.valid(false)
    }
  }, [Check, username, prop.dupliValue, prop.defaultValue])

  useEffect(() => {  // Set default value
    setUsername(prop.defaultValue || "")
    if (prop.defaultValue){
      setCheck(Check => ({...Check, haveMinChar: true}))
    }
  }, [prop.defaultValue])

  const handleUsernameChange = (event) => {  // Username conditions
    setUsername(event.target.value);
    prop.output(event.target.value);

    if (event.target.value.trim().length >= 4) {  // Check min number of char
      setCheck(Check => ({...Check, haveMinChar: true})
    )} else {
      setCheck(Check => ({...Check, haveMinChar: false})
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

  return (
    <div>
      <label>Usuário:</label>
      <input value={username} onChange={handleUsernameChange} id="username" type="text" name="username" />
      {!Check.haveMinChar && <div>minChar</div>}
      {!Check.noSpace && <div>noSpace</div>}
      {!Check.noSpecialChar && <div>noCharEspecial</div>}
      {!prop.dupliCheck && (prop.dupliValue === username) && <div>noUsed</div>}
      <div>{prop.dupliValue}</div>
    </div>
  )
}

export default Username