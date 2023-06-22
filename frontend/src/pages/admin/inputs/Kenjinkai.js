import React, { useState, useEffect } from 'react'

const regexnumber = /[0-9]/
const regexspace = /\s/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Kenjinkai(prop) {
  const [kenjinkai, setKenjinkai] = useState("")
  const [principal, setPrincipal] = useState("")
  const [K_Check, setK_Check] = useState({
    haveMinChar: false,
    noNumber: true,
    noSpace: true, 
    noSpecialChar: true});
  const [P_Check, setP_Check] = useState({
    haveMinChar: false,
    noNumber: true,
    noSpace: true, 
    noSpecialChar: true});
  const [submitvalid, setSubmitvalid] = useState(false);

  useEffect(() => {  // Check all conditions
    if (K_Check.haveMinChar &&
        K_Check.noNumber &&
        K_Check.noSpace &&
        K_Check.noSpecialChar &&
        P_Check.haveMinChar &&
        P_Check.noNumber &&
        P_Check.noSpace &&
        P_Check.noSpecialChar &&
        prop.defaultValue !== kenjinkai &&
        prop.dupliValue !== kenjinkai){
      setSubmitvalid(true);
      prop.valid(true)
    } else {
      setSubmitvalid(false);
      prop.valid(false)
    }
  }, [K_Check, P_Check, kenjinkai, prop.dupliValue, prop.defaultValue])

  const handleKenjinkaiChange = (event) => {  // Username conditions
    setKenjinkai(event.target.value);
    prop.output_K(event.target.value);

    if (event.target.value.trim().length > 4) {  // Check min number of char
      setK_Check(K_Check => ({...K_Check, haveMinChar: true})
    )} else {
      setK_Check(K_Check => ({...K_Check, haveMinChar: false})
    )};

    if (!regexnumber.test(event.target.value)) {  // Check use of number
      setK_Check(K_Check => ({...K_Check, noNumber: true})
    )} else {
      setK_Check(K_Check => ({...K_Check, noNumber: false})
    )};

    if (!regexspace.test(event.target.value)) {  // Check use of space
      setK_Check(K_Check => ({...K_Check, noSpace: true})
    )} else {
      setK_Check(K_Check => ({...K_Check, noSpace: false})
    )};

    if (!regexspecial.test(event.target.value)) {  // Check use of special char
      setK_Check(K_Check => ({...K_Check, noSpecialChar: true})
    )} else {
      setK_Check(K_Check => ({...K_Check, noSpecialChar: false})
    )};
  };

  const handlePrincipalChange = (event) => {  // Username conditions
    setPrincipal(event.target.value);
    prop.output_P(event.target.value);

    if (event.target.value.trim().length > 4) {  // Check min number of char
      setP_Check(P_Check => ({...P_Check, haveMinChar: true})
    )} else {
      setP_Check(P_Check => ({...P_Check, haveMinChar: false})
    )};

    if (!regexnumber.test(event.target.value)) {  // Check use of number
      setP_Check(P_Check => ({...P_Check, noNumber: true})
    )} else {
      setP_Check(P_Check => ({...P_Check, noNumber: false})
    )};

    if (!regexspace.test(event.target.value)) {  // Check use of space
      setP_Check(P_Check => ({...P_Check, noSpace: true})
    )} else {
      setP_Check(P_Check => ({...P_Check, noSpace: false})
    )};

    if (!regexspecial.test(event.target.value)) {  // Check use of special char
      setP_Check(P_Check => ({...P_Check, noSpecialChar: true})
    )} else {
      setP_Check(P_Check => ({...P_Check, noSpecialChar: false})
    )};
  };

  return (
    <>
      <label>Kenjinkai:</label>
      <input value={kenjinkai} onChange={handleKenjinkaiChange} id="kenjinkai" type="text" name="kenjinkai"/>
      {!K_Check.haveMinChar && <div>minChar</div>}
      {!K_Check.noNumber && <div>nonumber</div>}
      {!K_Check.noSpace && <div>noSpace</div>}
      {!K_Check.noSpecialChar && <div>noSpecialChar</div>}
      {!prop.dupliCheck && (prop.dupliValue === kenjinkai) && <div>noUsed</div>}
      <div>{prop.dupliValue}</div>
      <label>Diretoria:</label>
      <input value={principal} onChange={handlePrincipalChange} id="principal" type="text" name="principal"/>
      {!P_Check.haveMinChar && <div>minChar</div>}
      {!P_Check.noNumber && <div>nonumber</div>}
      {!P_Check.noSpace && <div>noSpace</div>}
      {!P_Check.noSpecialChar && <div>noSpecialChar</div>}
    </>
  )
}

export default Kenjinkai