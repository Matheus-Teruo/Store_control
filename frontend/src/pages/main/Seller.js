import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth_context';
import Code from '../admin/inputs/Code'

function Seller() {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [card, setCard] = useState("")
  const [stand, setStand] = useState({standID:0 ,stand:""})
  const [items, setItems] = useState([])
  const [check, setCheck] = useState({
    purchase: false,
    card: false})
  const [confirmPurchase, setConfirmPurchase] = useState(false)
  const [messageValue, setMessageValue] = useState("")
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {  // Load from pages
    if (auth.user.authenticated === true) {
      RequestLists()
    } else if (auth.user.authenticated === false) {
      navigate('/login');
    }
  }, [auth, navigate])

  async function RequestLists() {  // List all itens by stand
    var resStatus;
      fetch('/api/listitemsbystand')
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            setStand({standID: data.standID,stand:data.stand})
            return setItems(data.items)
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
  }

  async function SubmitPurchase() {  // Submit the recharge
    if (auth.user.authenticated) {
      var resStatus;
      fetch("/api/purchase", {  // Post form
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "standID": stand.standID,
          "cardID": card,
          "items": cart
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            RequestLists()
            setCart([]); setCard(0);
            setConfirmPurchase(false); setCheck({purchase: false, card: false})
            SubmitCardCheck()
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch((error) => {
          console.error(error.message);
        })
    }
  }

  async function SubmitCardCheck() {
    var resStatus;
      fetch("/api/cardcheck", {  // Post form
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"cardID": card})
      })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        setMessageValue(data.value)
      })
  }

  useEffect(() => {  // Sum the total
    const subtotal = cart.reduce((accumulator, element) => {
      return accumulator + (element.price * element.amount);
    }, 0);
    setTotal(subtotal);
  }, [cart])

  useEffect(() => {  // Set check to purchase
    if (total > 0) {
      return setCheck(check => ({...check, purchase: true}))
    } else {
      return setCheck(check => ({...check, purchase: false}))
    }
  }, [total])
  
  function handleCart(item) {  // Add item on cart
    if (cart.some(element => element.itemID === item.itemID)){
      const updatedCart = cart.map(element => {
        if (element.itemID === item.itemID) {
          if (item.stock > element.amount){
            return {...element, amount: element.amount + 1};
          }
          return element;
        }
        return element;
      });
      setCart(updatedCart);
    } else {
      setCart(cart => [...cart, {
        itemID:item.itemID,
        item:item.item,
        price:item.price,
        amount:1}])
    }
  };
  function handleRemoveCart(itemID) {  // Remove item from cart
    const updatedCart = cart.map(element => {
      if (element.itemID === itemID) {
        const updatedAmount = element.amount - 1;
        if (updatedAmount <= 0) {
          return null;
        } else {
          return {...element, amount: updatedAmount};
        }
      }
      return element;  // return other itens
    }).filter(Boolean)
    setCart(updatedCart);
  }

  return (
    <div>
      <div>
        <h1>{stand.stand}</h1>
        <div>
          <h2>Menu</h2>
        </div>
        <div>
          <Code
            output={event => setCard(event.target.value)}
            card={card}
            dupliValue={""}
            valid={(value) => setCheck(check => ({...check, card:value}))}/>
          <button onClick={() => SubmitCardCheck()} disabled={check.card ? false : true}>Verificar Cartão</button>
          <div>
            <p>{messageValue}</p>
          </div>
        </div>
        <div>
          <ul>
            <li><p>Nome</p><p>Preço</p><p>estoque</p><p>carrinho</p></li>
            {items.map((item) => (
              <li key={item.itemID}>
                <div onClick={() => handleCart(item)}>
                  <p>{item.item}</p>
                  <p>R${item.price}</p>
                  <p>{item.stock}</p>
                </div>
                <p onClick={() => handleRemoveCart(item.itemID)}>
                {cart.filter(element => element.itemID === item.itemID).length > 0 &&
                  <>{cart.filter(element => element.itemID === item.itemID)[0].amount}</>
                }</p>
              </li>
            ))}
          </ul>
          <button onClick={() => setConfirmPurchase(true)} disabled={check.purchase ? false : true}>Finalizar compra</button>
        </div>
        <p>{total}</p>
        {confirmPurchase &&
        <div>
          <div>
            <p>{total}</p>
            <Code
              output={event => setCard(event.target.value)}
              card={card}
              dupliValue={""}
              valid={(value) => setCheck(check => ({...check, card:value}))}/>
            <button onClick={() => setConfirmPurchase(false)}>Cancelar</button>
            <button onClick={() => SubmitPurchase()} disabled={check.purchase && check.card ? false : true}>Confirmar</button>
          </div>
        </div>
        }
      </div>
    </div>
  )
}

export default Seller