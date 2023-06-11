import React, { useState, useEffect} from 'react'

function ConfirmPurchase() {
  const [items, setItems] = useState([]);
  const [cardNumber, setcardNumber] = useState('');

  const handleCardNumberChange = (event) => {
    setcardNumber(event.target.value);
  };

  const handleFinalizePurchase = (event) => {
    event.preventDefault();

    // Perform purchase finalization logic here
    // using the cardNumber value

    // Example: Printing the card details
    console.log('Card Number:', cardNumber);

    // Reset the form
    setcardNumber('');
  };

  return (
    <div>
      <h1>Finalizar Compra</h1>
      <form onSubmit={handleFinalizePurchase}>
        <div>
          <h2>Items</h2>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                <strong>Item:</strong> {item.item} |
                <strong>Amount:</strong> {item.amount} |
                <strong>Price:</strong> {item.price}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label>Order Number:</label>
          <input
            type="text"
            pattern="\d{12}"
            value={cardNumber}
            onChange={handleCardNumberChange}
            required
          />
        </div>
        <button type="submit">Finalizar Compra</button>
      </form>
      <div>
        
      </div>
    </div>
  )
}

export default ConfirmPurchase