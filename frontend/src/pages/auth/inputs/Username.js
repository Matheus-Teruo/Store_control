import React, { useState, useEffect } from 'react'
import { User, UserCheck, UserX } from 'react-feather';

const regexspace = /\s/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Username(props) {
  const [Check, setCheck] = useState({
    haveMinChar: false,
    noSpace: true, 
    noSpecialChar: true});
  const [isFoc, setIsFoc] = useState(false);
  const [animation, setAnimation] = useState(false)
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
  }, [Check, props.dupliValue, props.username])

  useEffect(() => {  // Conditions logic
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
  
  useEffect(() => {  // Set animation
    if (props.requiredField > 0 && !submitvalid) {
      setAnimation(true)
      setTimeout(() => {
        setAnimation(false);
      }, 1000);
    }
  }, [props.requiredField])
  
  const classUsername = `SignupInput ${isFoc ? 'focused' : !props.requiredField > 0? (props.username === "" ? "" : submitvalid  ? 'unfocOK' : 'unfocNO') : submitvalid  ? 'unfocOK' : 'unfocNO'}`

  return (
    <div className="UsernameInput">
      <div className={classUsername} onFocus={() => setIsFoc(true)} onBlur={() => setIsFoc(false)}>
        <label className={`${animation ? 'shake' : ''}`} htmlFor="username">
          {props.username === "" ?
            <User/>
          : submitvalid === true ?
            <UserCheck className="IconUser"/>
          : submitvalid === false &&
            <UserX className="IconUser"/>
          }
        </label>
        <input value={props.username} onChange={event => props.output(event)} placeholder="Usuário" id="username" type="text" name="username" />
      </div>
      <div className="UsernameCheck">
        {props.username !== "" && !Check.haveMinChar && <div>Número mínimo de carácter</div>}
        {props.username !== "" && !Check.noSpace && <div>Não pode conter espaços</div>}
        {props.username !== "" && !Check.noSpecialChar && <div>Não pode conter carácter especial</div>}
        {props.dupliValue !== "" && (props.dupliValue === props.username) && <div>Usuário já utilizado</div>}
      </div>
    </div>
  )
}

export default Username