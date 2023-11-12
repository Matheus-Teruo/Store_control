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
    <div className="PaymentMethod">
      <label className={`${payment === "cash" && "check"}`}>
        <input type="radio" name="paymentOption" value="cash" checked={payment === 'cash'} onChange={handlePaymentChange}/>
        <span>Dinheiro</span>
      </label>
      <label className={`${payment === "debit" && "check"}`}>
        <input type="radio" name="paymentOption" value="debit" checked={payment === 'debit'} onChange={handlePaymentChange}/>
        <span>Débito</span>
      </label>
      <label className={`${payment === "credit" && "check"}`}>
        <input type="radio" name="paymentOption" value="credit" checked={payment === 'credit'} onChange={handlePaymentChange}/>
        <span>Crédito</span>
      </label>
    </div>
  )
}

export default Payment