import React, { useState, useEffect } from 'react'

function Code(props) {
  const [check, setCheck] = useState(false)
  const [submitvalid, setSubmitvalid] = useState(false)

  useEffect(() => {  // Check all conditions
    if (check &&
        props.dupliValue !== props.card){
      setSubmitvalid(true);
      props.valid(true)
    } else {
      setSubmitvalid(false);
      props.valid(false)
    }
  }, [check, props.card, props.dupliValue])

  useEffect(() => {
    if (props.card.length === 12) {  // Check min number of char
      setCheck(true)
    } else {
      setCheck(false)
    };
  })
  function handleCard(event){  // Conditions logic
    props.output(event)
    if (event.target.value.length === 12) {  // Check min number of char
      setCheck(true)
    } else {
      setCheck(false)
    };
  }


  return (
    <>
      <input className={` ${submitvalid ? "CardValid" : "CardInvalid"}`} value={props.card} onChange={handleCard} placeholder={`${(props.dupliValue !== "" && (props.dupliValue === props.card)) ? "Cartão já cadastrado" : ""}`} id="card" type="number" inputMode="numeric" name="card"/>
    </>
  )
}

export default Code