import React, { useState, useEffect } from 'react'
import { Award, Flag } from 'react-feather';

const regexnumber = /[0-9]/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Stands(props) {
  const [Check, setCheck] = useState({
    haveMinChar: false,
    noNumber: true,
    noSpecialChar: true});
  const [submitvalid, setSubmitvalid] = useState(false);

  useEffect(() => {  // Check all conditions
    if (Check.haveMinChar &&
        Check.noNumber &&
        Check.noSpecialChar &&
        props.associationID !== 0 &&
        props.dupliValue !== props.stand){
      setSubmitvalid(true);
      props.valid(true)
    } else {
      setSubmitvalid(false);
      props.valid(false)
    }
  }, [Check, props.stand, props.associationID, props.dupliValue])

  useEffect(() => {  // Conditions logic
    if (props.stand.trim().length > 2 && props.stand.trim().length < 30) {  // Check min number of char
      setCheck(Check => ({...Check, haveMinChar: true})
    )} else {
      setCheck(Check => ({...Check, haveMinChar: false})
    )};

    if (!regexnumber.test(props.stand)) {  // Check use of number
      setCheck(Check => ({...Check, noNumber: true})
    )} else {
      setCheck(Check => ({...Check, noNumber: false})
    )};

    if (!regexspecial.test(props.stand)) {  // Check use of special char
      setCheck(Check => ({...Check, noSpecialChar: true})
    )} else {
      setCheck(Check => ({...Check, noSpecialChar: false})
    )};
  }, [props.stand])

  return (
    <div className="Inputs">
      <div className="Stand">
        <label><Award/></label>
        <input value={props.stand} onChange={event => props.output(event)}
          id="stand" type="text" name="stand" placeholder="Estande"/>
      </div>
      <div className="Check">
        {props.stand !== "" && !Check.haveMinChar && <div><span>Entre 3 e 30 caractere</span></div>}
        {props.stand !== "" && !Check.noNumber && <div><span>Não pode conter número</span></div>}
        {props.stand !== "" && !Check.noSpecialChar && <div><span>Proibído caracteres especiais</span></div>}
        {props.dupliValue !== "" && (props.dupliValue === props.stand) && <div><span>Nome já usado</span></div>}
      </div>
      <div className="AssociationID">
        <label htmlFor="association"><Flag/></label>
        <select value={props.associationID} onChange={event => props.output(event)} id="associationID" name="associationID">
          <option value={0}>-</option>
          {props.associations.map((association) => (
            <option key={association.associationID} value={association.associationID}>{association.association}</option>
          ))}
        </select>
      </div>
      <div className="Check"/>
    </div>
  )
}

export default Stands