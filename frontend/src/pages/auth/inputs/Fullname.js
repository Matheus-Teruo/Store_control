import React, { useState, useEffect } from 'react';
import { Meh , Smile , Frown } from 'react-feather';

const regexnumber = /[0-9]/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Fullname(props) {
  const [Check, setCheck] = useState({
    haveMinChar: false,
    noNumber: true,
    noSpecialChar: true});
  const [isFoc, setIsFoc] = useState(false);
  const [animation, setAnimation] = useState(false)
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

  useEffect(() => {  // Conditions logic
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
  
  useEffect(() => {  // Set animation
    if (props.requiredField > 0 && !submitvalid) {
      setAnimation(true)
      setTimeout(() => {
        setAnimation(false);
      }, 1000);
    }
  }, [props.requiredField])

  const classFullname = `SignupInput ${isFoc ? 'focused' : !props.requiredField > 0? (props.fullname === "" ? "" : submitvalid  ? 'unfocOK' : 'unfocNO') : submitvalid  ? 'unfocOK' : 'unfocNO'}`

  return (
    <div className="FullnameInput">
      <div className={classFullname} onFocus={() => setIsFoc(true)} onBlur={() => setIsFoc(false)}>
        <label className={`${animation ? 'shake' : ''}`} htmlFor="fullname">
          {props.fullname === "" ?
            <Meh/>
          : submitvalid === true ?
            <Smile/>
          : submitvalid === false &&
            <Frown/>
          }
        </label>
        <input value={props.fullname} onChange={event => props.output(event)} placeholder="Nome Completo" id="fullname" type="text" name="fullname" />
      </div>
      <div className="FullnameCheck">
        {props.fullname !== "" && !Check.haveMinChar && <div>Número mínimo de carácter</div>}
        {props.fullname !== "" && !Check.noNumber && <div>Não pode conter número</div>}
        {props.fullname !== "" && !Check.noSpecialChar && <div>Não pode conter carácter especial</div>}
        {props.dupliValue !== "" && (props.dupliValue === props.fullname) && <div>Nome completo já cadastrado</div>}
      </div>
    </div>
  )
}

export default Fullname