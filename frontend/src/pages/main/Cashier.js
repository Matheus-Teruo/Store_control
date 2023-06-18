import React, { useState } from 'react'

function Cashier() {
  const [helper,setHelper] = useState(false)
  const [stands, setStands] = useState([
    {id: 1, name: 'stand1'},
    {id: 2, name: 'stand2'},
    {id: 3, name: 'stand3'}]);
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const handleWindowClick = (IDstand) => {
    // Generate and update new items for the body based on the window clicked
    const newItems = generateItems(IDstand);
    setItems(newItems);
    setStands([
      {id: 1, name: 'stand1'},
      {id: 2, name: 'stand2'},
      {id: 3, name: 'stand3'}])
  };

  const generateItems = (IDstand) => {
    switch (IDstand) {
      case 1:
        return [
          { id: 1, name: 'Item 1', price: 10 },
          { id: 2, name: 'Item 2', price: 15 },
          { id: 3, name: 'Item 3', price: 20 },
        ];
      case 2:
        return [
          { id: 4, name: 'Item 4', price: 12 },
          { id: 5, name: 'Item 5', price: 18 },
          { id: 6, name: 'Item 6', price: 25 },
        ];
      case 3:
        return [
          { id: 7, name: 'Item 7', price: 8 },
          { id: 8, name: 'Item 8', price: 14 },
          { id: 9, name: 'Item 9', price: 22 },
        ];
      default:
        return [];
    }
  };

  const handleTotal = (event) => {
    setTotalPrice(event.target.value)
  };

  const handleSumTotal = (price) => {
    setTotalPrice(price + parseInt(totalPrice))
  };

  return (
    <div>
      <button onClick={() => setHelper(!helper)}>
        Auxiliar
      </button>
      {helper && (
      <div>
        <div>
          {stands.length === 0 ? (
            <div>Nenhum estande no banco de dados</div>
          ) : (
            <ul>
              {stands.map((stand) => (
                <li
                  className="window"
                  onClick={() => handleWindowClick(stand.id)}
                  key={stand.id}
                >
                  {stand.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          {items.length === 0 ? (
            <div>No items selected.</div>
          ) : (
            <ul>
              {items.map((item) => (
                <li onClick={() => handleSumTotal(item.price)} key={item.id}>
                  <strong>Name:</strong> {item.name}
                  <strong>Price:</strong> ${item.price}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      )}
      <div>
        <input
          type="number"
          value={totalPrice}
          onChange={handleTotal}
        />
      </div>
    </div>
  )
}

export default Cashier