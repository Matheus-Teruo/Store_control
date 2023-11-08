import React, { useState, useEffect } from 'react'

function Payment(props) {
  const [payment, setPayment] = useState("cash")

  useEffect(() => {
    return setPayment(props.input)
  }, [props.input])

  function handlePaymentChange(event) {
    props.output(event.target.value)
    setPayment(event.target.value);
  }

  return (
    <div className="Payment">
      <label className={`${payment === "cash" && "check"}`}>
        <input type="radio" name="paymentOption" value="cash" checked={payment === 'cash'} onChange={handlePaymentChange}/>
        Dinheiro
      </label>
      <label className={`${payment === "debit" && "check"}`}>
        <input type="radio" name="paymentOption" value="debit" checked={payment === 'debit'} onChange={handlePaymentChange}/>
        Débito
      </label>
      <label className={`${payment === "credit" && "check"}`}>
        <input type="radio" name="paymentOption" value="credit" checked={payment === 'credit'} onChange={handlePaymentChange}/>
        Crédito
      </label>
    </div>
  )
}

export default Payment