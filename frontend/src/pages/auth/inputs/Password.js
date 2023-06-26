import React, { useState, useEffect } from 'react'

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
  const [PW_D_Check, setPW_D_Check] = useState(true);
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

  useEffect(() => {  // Check password confirmation
    if (password === passwordC) {
      setPW_D_Check(true)
    } else {
      setPW_D_Check(false)
    }
  }, [password, passwordC])

  const handlePasswordChange = (event) => {  // Password conditions
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

  return (
    <div>
      <div>
        <label htmlFor="password">Senha:</label>
        <input value={props.password} onChange={handlePasswordChange} id="password" type="password" name="password" />
        <div>
          {!Check.haveMinChar && <div>minChar</div>}
          {!Check.haveLetter && <div>haveletter</div>}
          {!Check.haveNumber && <div>havenumber</div>}
          {!Check.noSpace && <div>noSpace</div>}
        </div>
      </div>
      <div>
        <label htmlFor="PW_D_Check">Confirmar senha:</label>
        <input value={passwordC} onChange={handlePasswordChangeC} id="PW_D_Check" type="password" name="PW_D_Check" />
        <div>
          {!PW_D_Check && <div>noMatch</div>}
        </div>
      </div>
    </div>
  )
}

export default Password