import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function Seller() {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', price: 10, count: 0 },
    { id: 2, name: 'Item 2', price: 15, count: 0 },
    { id: 3, name: 'Item 3', price: 20, count: 0 },
  ]);

  const handleAddItem = (itemId) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, count: (item.count || 0) + 1};
      }
      return item;
    });
    console.log(updatedItems)
    setItems(updatedItems);
  };

  const handleSubtractItem = (itemId) => {
    const updatedItems = items.map((item) => {
      if (item.id === itemId) {
        return { ...item, count: (item.count || 0) - 1};
      }
      return item;
    });
    console.log(updatedItems)
    setItems(updatedItems);
  };

  const handleAddCardNumber = () => {
    // Implement the logic for adding card number here
    console.log('Add Card Number clicked');
  };

  return (
    <div>
      <h1>Item Page</h1>
      <div>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              border: '1px solid black',
              padding: '10px',
              marginBottom: '10px',
              cursor: 'pointer',
            }}
          >
            <div onClick={() => handleAddItem(item.id)}>
              <div>
                <strong >Name:</strong> {item.name}
              </div>
              <div>
                <strong>Price:</strong> ${item.price}
              </div>
            </div>
            {item.count!=0 && (
              <div>
                <div onClick={() => handleSubtractItem(item.id)}>
                  menos
                </div>
                {item.count}
              </div>
            )}
          </div>
        ))}
      </div>
      <Link to='/vendedor/confirmar-compra'>Add Card Number</Link>
    </div>
  )
}

export default Seller