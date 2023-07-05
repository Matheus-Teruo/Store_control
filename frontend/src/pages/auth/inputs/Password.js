import React, { useState, useEffect } from 'react'
import { Lock, Unlock } from 'react-feather';

const regexnumber = /[0-9]/
const regexletter = /[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/
const regexspace = /\s/

function Password(props) {
  const [password, setPassword] = useState("");
  const [passwordC, setPasswordC] = useState("");
  const [Check, setCheck] = useState({
    haveMinChar: false,
    noSpace: true,
    haveLetter: false,
    haveNumber: false});
  const [checkAll, setCheckAll] = useState(false)
  const [PW_D_Check, setPW_D_Check] = useState(true);
  const [isFocPW, setIsFocPW] = useState(false);
  const [isFocPWC, setIsFocPWC] = useState(false);
  const [animationPW, setAnimationPW] = useState(false)
  const [animationPWC, setAnimationPWC] = useState(false)
  const [submitvalid, setSubmitvalid] = useState(false);

  useEffect(() => {  // Check all conditions
    if (Check.haveMinChar &&
        Check.noSpace &&
        Check.haveLetter &&
        Check.haveNumber &&
        PW_D_Check){
          setSubmitvalid(true);
          props.valid(true)
        } else {
          setSubmitvalid(false);
          props.valid(false)
        }
  }, [Check, PW_D_Check])

  useEffect(() => {
    if (Check.haveMinChar &&
        Check.noSpace &&
        Check.haveLetter &&
        Check.haveNumber){
          setCheckAll(true)
        } else {
          setCheckAll(false)
        }
  }, [Check])
  

  useEffect(() => {  // Check password confirmation
    if (password === passwordC) {
      setPW_D_Check(true)
    } else {
      setPW_D_Check(false)
    }
  }, [password, passwordC])

  useEffect(() => {  // Set animation
    if (props.requiredField > 0){
      if (!checkAll) {
        setAnimationPW(true)
        setTimeout(() => {
          setAnimationPW(false);
        }, 1000);
      }
      if (!PW_D_Check || passwordC === "") {
        setAnimationPWC(true)
        setTimeout(() => {
          setAnimationPWC(false);
        }, 1000);
      }
    }
  }, [props.requiredField])

  const handlePasswordChange = (event) => {  // Conditions logic
    props.output(event);
    setPassword(event.target.value);

    if (event.target.value.length >= 6) {  // Check min number of char
      setCheck(Check => ({...Check, haveMinChar: true})
    )} else {
      setCheck((Check) => ({...Check, haveMinChar: false})
    )};

    if (regexletter.test(event.target.value)) {  // Check letter in password
      setCheck((Check) => ({...Check, haveLetter: true})
    )} else {
      setCheck((Check) => ({...Check, haveLetter: false})
    )};

    if (regexnumber.test(event.target.value)) {  // Check number in password
      setCheck(Check => ({...Check, haveNumber: true})
    )} else {
      setCheck(Check => ({...Check, haveNumber: false})
    )};

    if (!regexspace.test(event.target.value)) {  // Check use of space
      setCheck(Check => ({...Check, noSpace: true})
    )} else {
      setCheck((Check) => ({...Check, noSpace: false})
    )};
  };  

  const handlePasswordChangeC = (event) => {  // Password confirmation set
    setPasswordC(event.target.value);
  };

  const classPassword = `SignupInput ${isFocPW ? 'focused' : !props.requiredField > 0? (password === "" ? "" : checkAll  ? 'unfocOK' : 'unfocNO') : checkAll  ? 'unfocOK' : 'unfocNO'}`
  const classPasswordC = `SignupInput ${isFocPWC ? 'focused' : !props.requiredField > 0? (passwordC === "" ? "" : PW_D_Check  ? 'unfocOK' : 'unfocNO') : passwordC === "" ? 'unfocNO' : PW_D_Check  ? 'unfocOK' : 'unfocNO'}`

  return (
    <div className="Password">
      <div className="PasswordPrimary">
        <div className={classPassword} onFocus={() => setIsFocPW(true)} onBlur={() => setIsFocPW(false)}>
          <label className={`${animationPW ? 'shake' : ''}`} htmlFor="password">
            {password === "" ?
              <Unlock/>
            : submitvalid === true ?
              <Lock/>
            : submitvalid === false &&
              <Unlock/>
            }
          </label>
          <input value={password} onChange={handlePasswordChange} placeholder={props.placeholder || "Senha"} id="password" type="password" name="password" />
        </div>
        <div className="PasswordPrimaryCheck">
          {password !== "" && !Check.haveMinChar && <div>Número mínimo de carácter</div>}
          {password !== "" && !Check.haveLetter && <div>Deve conter letra</div>}
          {password !== "" && !Check.haveNumber && <div>Deve conter número</div>}
          {password !== "" && !Check.noSpace && <div>Não pode conter espaços</div>}
        </div>
      </div>
      <div className="PasswordCopy">
        <div className={classPasswordC} onFocus={() => setIsFocPWC(true)} onBlur={() => setIsFocPWC(false)}>
          <label className={`${animationPWC ? 'shake' : ''}`} htmlFor="PW_D_Check">
            {passwordC === "" ?
              <Unlock/>
            : submitvalid === true ?
              <Lock/>
            : submitvalid === false &&
              <Unlock/>
            }
          </label>
          <input value={passwordC} onChange={handlePasswordChangeC} placeholder={props.placeholder !== undefined? `Confirma ${props.placeholder}` : "Confimar Senha"} id="PW_D_Check" type="password" name="PW_D_Check" />
        </div>
      <div className="PasswordCopyCheck">
        {passwordC !== "" && !PW_D_Check && <div>noMatch</div>}
      </div>
      </div>
    </div>
  )
}

export default Password