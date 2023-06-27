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

  useEffect(() => {  // Item name conditions
    if (props.card !== null && props.card.length === 12) {  // Check min number of char
      setCheck(true)
    } else {
      setCheck(false)
    };
  }, [props.card])

  return (
    <>
      <label>Código do Cartão:</label>
      <input value={props.card} onChange={event => props.output(event)} id="card" type="number" name="card"/>
      <div>
        {!check && <p>minChar</p>}
        {props.dupliValue !== "" && (props.dupliValue === props.card) && <div>noUsed</div>}
      </div>
    </>
  )
}

export default Code