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
    if (props.card.toString().length === 12) {  // Check min number of char
      setCheck(true)
    } else {
      setCheck(false)
    };
  }, [props.card])

  function handleCard(event){  // Conditions logic
    if (event.target.value.length <= 12){
      props.output(event)
      if (event.target.value.length === 12) {  // Check min number of char
        setCheck(true)
      } else {
        setCheck(false)
      };
    }
  }

  return (
    <>
      <input className={` ${submitvalid ? "CardValid" : "CardInvalid"}`}
        value={props.card}
        onChange={handleCard}
        id="card" type="number" inputMode="numeric" name="card"/>
    </>
  )
}

export default Code