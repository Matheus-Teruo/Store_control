import React, { useState, useEffect } from 'react'

const regexspace = /\s/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Username(props) {
  const [Check, setCheck] = useState({
    haveMinChar: false,
    noSpace: true, 
    noSpecialChar: true});
  const [submitvalid, setSubmitvalid] = useState(false);

  useEffect(() => {  // Check all conditions
    if (Check.haveMinChar &&
        Check.noSpace &&
        Check.noSpecialChar &&
        props.dupliValue !== props.username){
      setSubmitvalid(true);
      props.valid(true)
    } else {
      setSubmitvalid(false);
      props.valid(false)
    }
  }, [Check, props.username, props.dupliValue])

  useEffect(() => {  // Username conditions
    if (props.username.length >= 4) {  // Check min number of char
      setCheck(Check => ({...Check, haveMinChar: true})
    )} else {
      setCheck(Check => ({...Check, haveMinChar: false})
    )};

    if (!regexspace.test(props.username)) {  // Check use of space
      setCheck(Check => ({...Check, noSpace: true})
    )} else {
      setCheck(Check => ({...Check, noSpace: false})
    )};

    if (!regexspecial.test(props.username)) {  // Check use of special char
      setCheck(Check => ({...Check, noSpecialChar: true})
    )} else {
      setCheck(Check => ({...Check, noSpecialChar: false})
    )};
  }, [props.username])
  

  return (
    <div>
      <label>Usuário:</label>
      <input value={props.username} onChange={event => props.output(event)} id="username" type="text" name="username" />
      <div>
        {!Check.haveMinChar && <div>minChar</div>}
        {!Check.noSpace && <div>noSpace</div>}
        {!Check.noSpecialChar && <div>noCharEspecial</div>}
        {props.dupliValue !== "" && (props.dupliValue === props.username) && <div>noUsed</div>}
      </div>
    </div>
  )
}

export default Username