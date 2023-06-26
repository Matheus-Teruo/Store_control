import React, { useState, useEffect } from 'react'

const regexnumber = /[0-9]/
const regexspace = /\s/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Kenjinkai(props) {
  const [K_Check, setK_Check] = useState({
    haveMinChar: false,
    noNumber: true,
    noSpace: true, 
    noSpecialChar: true});
  const [P_Check, setP_Check] = useState({
    haveMinChar: false,
    noNumber: true,
    noSpecialChar: true});
  const [submitvalid, setSubmitvalid] = useState(false);

  useEffect(() => {  // Check all conditions
    if (K_Check.haveMinChar &&
        K_Check.noNumber &&
        K_Check.noSpace &&
        K_Check.noSpecialChar &&
        P_Check.haveMinChar &&
        P_Check.noNumber &&
        P_Check.noSpecialChar &&
        props.dupliValue !== props.kenjinkai){
      setSubmitvalid(true);
      props.valid(true)
    } else {
      setSubmitvalid(false);
      props.valid(false)
    }
  }, [K_Check, P_Check, props.kenjinkai, props.dupliValue])

  useEffect(() => {  // Kenjinkai conditions
    if (props.kenjinkai.trim().length >= 3) {  // Check min number of char
      setK_Check(K_Check => ({...K_Check, haveMinChar: true})
    )} else {
      setK_Check(K_Check => ({...K_Check, haveMinChar: false})
    )};

    if (!regexnumber.test(props.kenjinkai)) {  // Check use of number
      setK_Check(K_Check => ({...K_Check, noNumber: true})
    )} else {
      setK_Check(K_Check => ({...K_Check, noNumber: false})
    )};

    if (!regexspace.test(props.kenjinkai)) {  // Check use of space
      setK_Check(K_Check => ({...K_Check, noSpace: true})
    )} else {
      setK_Check(K_Check => ({...K_Check, noSpace: false})
    )};

    if (!regexspecial.test(props.kenjinkai)) {  // Check use of special char
      setK_Check(K_Check => ({...K_Check, noSpecialChar: true})
    )} else {
      setK_Check(K_Check => ({...K_Check, noSpecialChar: false})
    )};
  }, [props.kenjinkai])
  
  useEffect(() => {  // Principal conditions
    if (props.principal.trim().length >= 3) {  // Check min number of char
      setP_Check(P_Check => ({...P_Check, haveMinChar: true})
    )} else {
      setP_Check(P_Check => ({...P_Check, haveMinChar: false})
    )};

    if (!regexnumber.test(props.principal)) {  // Check use of number
      setP_Check(P_Check => ({...P_Check, noNumber: true})
    )} else {
      setP_Check(P_Check => ({...P_Check, noNumber: false})
    )};

    if (!regexspecial.test(props.principal)) {  // Check use of special char
      setP_Check(P_Check => ({...P_Check, noSpecialChar: true})
    )} else {
      setP_Check(P_Check => ({...P_Check, noSpecialChar: false})
    )};
  }, [props.principal])

  return (
    <>
      <label>Kenjinkai:</label>
      <input value={props.kenjinkai} onChange={event => props.output(event)} id="kenjinkai" type="text" name="kenjinkai"/>
      <div>
        {!K_Check.haveMinChar && <div>minChar</div>}
        {!K_Check.noNumber && <div>nonumber</div>}
        {!K_Check.noSpace && <div>noSpace</div>}
        {!K_Check.noSpecialChar && <div>noSpecialChar</div>}
        {props.dupliValue !== ""  && (props.dupliValue === props.kenjinkai) && <div>noUsed</div>}
      </div>
      <label>Diretoria:</label>
      <input value={props.principal} onChange={event => props.output(event)} id="principal" type="text" name="principal"/>
      <div>
        {!P_Check.haveMinChar && <div>minChar</div>}
        {!P_Check.noNumber && <div>nonumber</div>}
        {!P_Check.noSpecialChar && <div>noSpecialChar</div>}
      </div>
    </>
  )
}

export default Kenjinkai