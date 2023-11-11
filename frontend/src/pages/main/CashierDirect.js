import "./CashierDirect.css"
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { Image, DollarSign, Package, Plus, Minus, ShoppingBag, ShoppingCart, Trash2 } from 'react-feather';
import AuthContext from '../../store/auth_context';
import Payment from "./inputs/Payment";
import History from '../../midia/History';

function CashierDirect() {
  // Cart
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [check, setCheck] = useState({purchase: false})
  // Items
  const [stands, setStands] = useState();
  const [selectedID, setSelectedID] = useState(0)
  const [allItems, setAllItems] = useState([]);
  const [standIDs,setStandIDs] = useState([]);
  const [items, setItems] = useState([]);
  // Purchase
  const [donation, setDonation] = useState(0)
  const [payment, setPayment] = useState("cash")
  const [confirmPurchase, setConfirmPurchase] = useState(false)
  // Last Sales
  const [showLastCustomers, setShowLastCustomers] = useState(false)
  const [listLastSales, setListLastSales] = useState([])
  const [listLastGoods, setListLastGoods] = useState([])
  const [checkLastCustomer, setCheckLastCustomer] = useState(false)
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {  // Page requirements
    if (auth.user.authenticated === true) {
      RequestLists()
    } else if (auth.user.authenticated === false) {
      navigate('/login');
    }
  }, [auth, navigate])

  async function RequestLists() {  // List all itens and stands
    var resStatus;
      fetch('/api/listitems')
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            setStands(data.stands)
            return setAllItems(data.items)
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
  }

  async function SubmitRecharge() {  // Submit the recharge
    if (auth.user.authenticated) {
      const filteredItems = items.filter(item => item.amount !== 0);
      if (filteredItems.length > 0 && standIDs.length > 0){
        var resStatus;
        fetch("/api/recharge", {  // Post form
          method: "POST", headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            "recharge": (total + donation),
            "cardID": 111111111111,
            "payment": payment
          })
        })
          .then(res => {resStatus = res.status; return res.json()})
          .then(data => {
            if (resStatus === 200){
              SubmitPurchase();
            } else if (resStatus === 401){
              return auth.onLogout()
            }
          })
          .catch((error) => {
            console.error(error.message);
          })
      }else{
        setCart([]);
        setConfirmPurchase(false);
        return setCheck(check => ({...check, purchase: false}))
      }
    }
  }

  async function SubmitPurchase() {  // Submit the purchase
    if (auth.user.authenticated) {
      var resStatus;
      fetch("/api/purchasecustomer", {  // Post form
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "standIDs": standIDs,
          "cardID": 111111111111,
          "items": cart
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            RequestLists();
            setCart([]);
            SubmitReset();
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch((error) => {
          console.error(error.message);
        })
    }
  }

  async function SubmitReset() {  // Submit the recharge
    var type = "refund"
    if (donation > 0){type = "donation"}
    if (auth.user.authenticated) {
      var resStatus;
      fetch("/api/resetcard", {  // Post form
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "cardID": 111111111111,
          "finalization": type
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            setDonation(0);
            setConfirmPurchase(false);
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch((error) => {
          console.error(error.message);
        })
    }
  }

useEffect(() => {  // Handle select stand
  setItems(allItems.filter(item => {
    if (selectedID !== 0) {
      return item.standID === selectedID
    } else {
      return false
    }
  }))
}, [selectedID, allItems])

  useEffect(() => {  // Sum the total on cart and check purchase
    const subtotal = cart.reduce((accumulator, element) => {
      return accumulator + (element.price * element.amount);
    }, 0);
    setTotal(subtotal);
    if (cart.length > 0) {
      setCheck(check => ({...check, purchase: true}))
    } else {
      setCheck(check => ({...check, purchase: false}))
    }
  }, [cart])

  function handleCart(item) {  // Add item on cart
    if (!standIDs.includes(selectedID)) {
      setStandIDs(standIDs => [...standIDs, selectedID]); // Add the new standID to the state
    }
    if (cart.some(element => element.itemID === item.itemID)){
      const updatedCart = cart.map(element => {
        if (element.itemID === item.itemID) {
          if (item.stock > element.amount){
            return {...element, amount: element.amount + 1};
          } else { 
            return element;
          }
        } else {
          return element;
        }
      });
      setCart(updatedCart);
    } else if (item.stock !== 0){
      setCart(cart => [...cart, {
        standID:selectedID,
        itemID:item.itemID,
        item:item.item,
        price:item.price,
        amount:1}])
    }
  };

  function handleRemoveCart(itemID) {
    const updatedCart = cart.map(element => {
      if (element.itemID === itemID) {
        const updatedAmount = element.amount - 1;
        if (updatedAmount <= 0) {
          const standIDToRemove = element.standID;
          const itemsWithStandID = cart.filter(e => e.standID === standIDToRemove);
          
          if (itemsWithStandID.length === 1) {
            setStandIDs(standIDs => standIDs.filter(id => id !== standIDToRemove));
          }
          
          return null;
        } else {
          return { ...element, amount: updatedAmount };
        }
      }
      return element; // return other items
    }).filter(Boolean);
  
    setCart(updatedCart);
  }
  
  function handleEditCartItem(itemID, field, value) {
    const item = allItems.find(item => item.itemID === itemID);

    if (!item) {
      console.error(`Item with ID ${itemID} not found.`);
      return;
    }
  
    let newValue;
    if (field === 'amount') {
      newValue = Math.max(0, Math.min(Math.floor(value), item.stock));
    } else {
      newValue = value;
    }
  
    const updatedCart = cart.map(element => {
      if (element.itemID === itemID) {
        return { ...element, [field]: newValue };
      } else {
        return element;
      }
    });
  
    const standIDToUpdate = updatedCart.find(element => element.itemID === itemID)?.standID;
    const itemsWithStandID = updatedCart.filter(e => e.standID === standIDToUpdate);
  
    if (itemsWithStandID.length === 0) {
      setStandIDs(standIDs => standIDs.filter(id => id !== standIDToUpdate));
    } else if (!standIDs.includes(standIDToUpdate)) {
      setStandIDs(standIDs => [...standIDs, standIDToUpdate]);
    }
  
    setCart(updatedCart);
  }

  return (
    <div className="CD">
      <div className="Main">
        <div className="Menu">
          <div className="History">
            <button onClick={() => {setShowLastCustomers(true)}}><History/></button>
          </div>
          <ul>
            {stands && stands.map((stand) => (
              <li className={`Stand${stand.standID === selectedID ? " Selected" : ""}`} key={stand.standID} onClick={() => setSelectedID(stand.standID)}>
                {stand.stand}
              </li>
            ))}
          </ul>
        </div>
        <div className="Items">
          {selectedID !== 0 ? (items.length !== 0 ? 
          <ul>
            {items.map((item) => (
            <li key={item.itemID} className={`${item.stock === 0 && "unavailable"}`}>
              <div className="ItemImage" onClick={() => handleCart(item)}>
                {item.item_img !== null ?
                  <img alt={item.item} src={`/api/itemimages/${item.itemID}.${item.item_img}`}/>
                :
                  <Image/>
                }
              </div>
              <div className="Item" onClick={() => handleCart(item)}>
                <p id="name">{item.item}</p>
                <div className="ItemFooter">
                  <p id="price"><DollarSign/>{item.price}</p>
                  <p id="stock" className={`${item.stock && "unavailable"}`}><Package />{item.stock}</p>
                </div>
              </div>
              <p id="amount" onClick={() => handleRemoveCart(item.itemID)}>
                  {cart.filter(element => element.itemID === item.itemID).length > 0 &&
                    <><ShoppingBag/>{cart.filter(element => element.itemID === item.itemID)[0].amount}</>
                  }
                </p>
            </li>
            ))}
          </ul>
          :
          <div className="ItemsEmpty"><p>Nenhum item no estande</p></div>)
          :
          <div className="ItemsEmpty"><p>Selecione um estande</p></div>
          }
        </div>
        <div className="Footer">
          <p>Total:</p>
          <p id="total"><DollarSign size={20}/>{parseFloat(total).toFixed(2)}</p>
          <button onClick={() => {setConfirmPurchase(true)}} disabled={check.purchase ? false : true}><ShoppingCart/></button>
        </div>
      </div>


      {confirmPurchase &&
      <>
      <div className="BlackBackground" onClick={() => setConfirmPurchase(false)}/>
      <div className="Purchase">
        <h3>Finalizar Compra</h3>
        <div className="Cart">
          <ul>
            {cart.length !== 0 && cart.map(item => (
              <li key={item.itemID}>
                <p id="name" onClick={() => handleEditCartItem(item.itemID, 'amount', (item.amount + 1))}>{item.item}</p>
                <div id="price">
                  <DollarSign size={20}/>
                  <input
                    id="price" type="number" inputMode="numeric"
                    value={item.price}
                    onChange={event => handleEditCartItem(item.itemID, 'price', event.target.value)}/>
                </div>
                <div id="amount">
                  <Plus size={20} onClick={() => handleEditCartItem(item.itemID, 'amount', (item.amount + 1))}/>
                  <input
                    id="amount" type="number" inputMode="numeric"
                    value={item.amount}
                    onChange={event => handleEditCartItem(item.itemID, 'amount', event.target.value)}/>
                  <Minus size={20} onClick={() => handleRemoveCart(item.itemID)}/>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="Payment">
          <p>Recarregar</p>
          <p id="total"><DollarSign size={20}/>{parseFloat(total).toFixed(2)}</p>
          <Payment
            input={payment}
            output={(value) => setPayment(value)}/>
        </div>
        <div className="Footer">
          <button onClick={() => setConfirmPurchase(false)}>Cancelar</button>
          <button onClick={() => SubmitRecharge()}>Confirmar</button>
        </div>
      </div>
      </>
      }

      {showLastCustomers &&
      <>
      <div className="BlackBackground" onClick={() => setShowLastCustomers(false)}/>
      <div className="LastSales">
        <h3>Histórico de compra</h3>
        <div className="MainSub">
          <ul className="Sales">
            <li key="1" className="ItemSale">
              <ul className="ListofGoods">
                  <li key="1" className="ItemGood">
                    <p id="name">Item name</p>
                    <p id="quantity"><ShoppingBag size={18}/>Shopping</p>
                    <p id="price"><DollarSign size={18}/>Money</p>
                  </li>
              </ul>
                <button id="discard"><Trash2/></button>
                <p id="discard"><Trash2/></p>
            </li>
          </ul>
        </div>
      </div>
      </>
      }
    </div>
  )
}

export default CashierDirect