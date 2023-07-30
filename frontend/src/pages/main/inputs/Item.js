import React, { useState, useEffect } from 'react'
import { Tag, DollarSign, Package } from 'react-feather';


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

  useEffect(() => {  // Name conditions logic
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
  
  useEffect(() => {  // Price conditions logic
    if (parseInt(props.price) >= 0) {  // Check positive not zero
      setP_Check(true)
    } else {
      setP_Check(false)
    };
  }, [props.price])
  
  useEffect(() => {  // Stock conditions logic
    if (parseInt(props.stock) >= 0) {  // Check positive not zero
      setS_Check(true)
    } else {
      setS_Check(false)
    };
  }, [props.stock])
  
  return (
    <div>
      <div className="Item">
        <label id="item"><Tag/></label>
        <input value={props.item} onChange={event => props.output(event)} id="item" type="text" name="item"/>
      </div>
      <div className="Check">
        {!I_Check.haveMinChar && <p>minChar</p>}
        {!I_Check.noSpecialChar && <div>noSpecialChar</div>}
        {props.dupliValue !== "" && (props.dupliValue === props.item) && <div>noUsed</div>}
      </div>
      <div className="Price">
        <label id="price"><DollarSign/></label>
        <input value={props.price} onChange={event => props.output(event)} id="price" type="number" name="price" min="0"/>
      </div>
      <div className="Check">
        {!P_Check && <p>noZero</p>}
      </div>
      <div className="Stock">
        <label id="stock" ><Package/></label>
        <input value={props.stock} onChange={event => props.output(event)} id="stock" inputMode="numeric" type="number" name="stock" min="0"/>
      </div>
      <div className="Check">
        {!S_Check && <p>noZero</p>}
      </div>
    </div>
  )
}

export default Item