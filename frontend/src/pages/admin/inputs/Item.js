import React, { useState, useEffect } from 'react'

const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Item(props) {
  const [I_Check, setI_Check] = useState({
    haveMinChar: false,
    noSpecialChar: true})
  const [P_Check, setP_Check] = useState(false)
  const [S_Check, setS_Check] = useState(false)
  const [submitvalid, setSubmitvalid] = useState(false)

  useEffect(() => {  // Check all conditions
    if (I_Check.haveMinChar &&
        I_Check.noSpecialChar &&
        P_Check &&
        S_Check &&
        props.dupliValue !== props.item){
      setSubmitvalid(true);
      props.valid(true)
    } else {
      setSubmitvalid(false);
      props.valid(false)
    }
  }, [I_Check, P_Check, S_Check, props.item, props.dupliValue])

  useEffect(() => {  // Item name conditions
    if (props.item.trim().length >= 3) {  // Check min number of char
      setI_Check(I_Check => ({...I_Check, haveMinChar: true})
    )} else {
      setI_Check(I_Check => ({...I_Check, haveMinChar: false})
    )};

    if (!regexspecial.test(props.item)) {  // Check use of special char
      setI_Check(I_Check => ({...I_Check, noSpecialChar: true})
    )} else {
      setI_Check(I_Check => ({...I_Check, noSpecialChar: false})
    )};
  }, [props.item])
  
  useEffect(() => {  // Price conditions
    if (parseInt(props.price) > 0) {  // Check positive not zero
      setP_Check(true)
    } else {
      setP_Check(false)
    };
  }, [props.price])
  
  useEffect(() => {  // Stock conditions
    if (parseInt(props.stock) > 0) {  // Check positive not zero
      setS_Check(true)
    } else {
      setS_Check(false)
    };
  }, [props.stock])
  
  return (
    <>
      <label>item:</label>
      <input value={props.item} onChange={event => props.output(event)} id="item" type="text" name="item"/>
      <div>
        {!I_Check.haveMinChar && <p>minChar</p>}
        {!I_Check.noSpecialChar && <div>noSpecialChar</div>}
        {props.dupliValue !== "" && (props.dupliValue === props.item) && <div>noUsed</div>}
      </div>
      <label>preço:</label>
      <input value={props.price} onChange={event => props.output(event)} id="price" type="number" name="price" min="0"/>
      <div>
        {!P_Check && <p>noZero</p>}
      </div>
      <label>estoque:</label>
      <input value={props.stock} onChange={event => props.output(event)} id="stock" type="number" name="stock" min="0"/>
      <div>
        {!S_Check && <p>noZero</p>}
      </div>
    </>
  )
}

export default Item