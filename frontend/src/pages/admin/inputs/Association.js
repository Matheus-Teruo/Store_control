import React, { useState, useEffect } from 'react'
import { Flag, Star } from 'react-feather'

const regexnumber = /[0-9]/
const regexspace = /\s/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Association(props) {
  const [K_Check, setK_Check] = useState({
    haveMinChar: false,
    noNumber: true,
    noSpace: true, 
    noSpecialChar: true});
  const [P_Check, setP_Check] = useState({
    haveMinChar: false,
    noNumber: true,
    noSpecialChar: true});

  useEffect(() => {  // Check all conditions
    if (K_Check.haveMinChar &&
        K_Check.noNumber &&
        K_Check.noSpace &&
        K_Check.noSpecialChar &&
        P_Check.haveMinChar &&
        P_Check.noNumber &&
        P_Check.noSpecialChar &&
        props.dupliValue !== props.association){
      props.valid(true)
    } else {
      props.valid(false)
    }
  }, [K_Check, P_Check, props.association, props.dupliValue])

  useEffect(() => {  // Association conditions logic
    if (props.association.trim().length > 2 && props.association.trim().length < 30) {  // Check min number of char
      setK_Check(K_Check => ({...K_Check, haveMinChar: true})
    )} else {
      setK_Check(K_Check => ({...K_Check, haveMinChar: false})
    )};

    if (!regexnumber.test(props.association)) {  // Check use of number
      setK_Check(K_Check => ({...K_Check, noNumber: true})
    )} else {
      setK_Check(K_Check => ({...K_Check, noNumber: false})
    )};

    if (!regexspace.test(props.association)) {  // Check use of space
      setK_Check(K_Check => ({...K_Check, noSpace: true})
    )} else {
      setK_Check(K_Check => ({...K_Check, noSpace: false})
    )};

    if (!regexspecial.test(props.association)) {  // Check use of special char
      setK_Check(K_Check => ({...K_Check, noSpecialChar: true})
    )} else {
      setK_Check(K_Check => ({...K_Check, noSpecialChar: false})
    )};
  }, [props.association])
  
  useEffect(() => {  // Principal conditions logic
    if (props.principal.trim().length > 2 && props.principal.trim().length < 30) {  // Check min number of char
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
    <div className="Inputs">
      <div className="Association">
        <label><Flag/></label>
        <input value={props.association} onChange={event => props.output(event)}
          id="association" type="text" name="association" placeholder="Associação"/>
      </div>
      <div className="Check">
        {props.association !== "" && !K_Check.haveMinChar && <div><span>Entre 3 e 30 caractere</span></div>}
        {props.association !== "" && !K_Check.noNumber && <div><span>Não pode conter número</span></div>}
        {props.association !== "" && !K_Check.noSpace && <div><span>Não pode conter espaço</span></div>}
        {props.association !== "" && !K_Check.noSpecialChar && <div><span>Proibído caracteres especiais</span></div>}
        {props.dupliValue !== ""  && (props.dupliValue === props.association) && <div><span>Nome já usado</span></div>}
      </div>
      <div className="Principal">
        <label><Star/></label>
        <input value={props.principal} onChange={event => props.output(event)}
          id="principal" type="text" name="principal" placeholder="Diretoria"/>
      </div>
      <div className="Check">
        {props.principal !== "" && !P_Check.haveMinChar && <div><span>Entre 3 e 30 caractere</span></div>}
        {props.principal !== "" && !P_Check.noNumber && <div><span>Não pode conter número</span></div>}
        {props.principal !== "" && !P_Check.noSpecialChar && <div><span>Proibído caracteres especiais</span></div>}
      </div>
    </div>
  )
}

export default Association