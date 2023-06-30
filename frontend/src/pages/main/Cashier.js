import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth_context';
import Code from '../admin/inputs/Code';

function Cashier() {
  const [recharge, setRecharge] = useState(0)
  const [card, setCard] = useState("")
  const [cart, setCart] = useState([])
  const [sumAux, setSumAux] = useState(0)
  const [stands, setStands] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedID, setSelectedID] = useState(0)
  const [confirmRecharge, setConfirmRecharge] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [message, setMessage] = useState("")
  const [messageValue, setMessageValue] = useState(0)
  const [check, setCheck] = useState({
    recharge: false,
    card: false})
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
      var resStatus;
      fetch("/api/recharge", {  // Post form
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "recharge": recharge,
          "cardID": card
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            RequestLists()
            setRecharge(0); setCard(0);
            setConfirmRecharge(false); setCheck({recharge: false, card: false})
            return SubmitCardCheck()
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch((error) => {
          console.error(error.message);
          setMessage(error.message)
        })
    }
  }

  async function SubmitReset() {  // Submit the recharge
    if (auth.user.authenticated) {
      var resStatus;
      fetch("/api/resetcard", {  // Post form
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "cardID": card
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            RequestLists()
            setRecharge(0); setCard(0);
            setConfirmReset(false); setCheck({recharge: false, card: false})
            setMessage(`finalizado cartão: ${data.cardID}`); setMessageValue("")
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch((error) => {
          console.error(error.message);
          setMessage(error.message)
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
        setMessage(data.card)
        setMessageValue(data.value)
      })
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

  useEffect(() => {  // Sum the total auxiliary
    const subtotal = cart.reduce((accumulator, element) => {
      return accumulator + (element.price * element.amount);
    }, 0);
    setSumAux(subtotal);
  }, [cart])

  useEffect(() => {  // Set check to recharge
    if (recharge > 0) {
      return setCheck(check => ({...check, recharge: true}))
    } else {
      return setCheck(check => ({...check, recharge: false}))
    }
  }, [recharge])
  
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

  function h_Valid(value) {  // Card valid
    setCheck(check => ({...check, card: value}))
  };

  return (
    <div>
      <div>
        <div>
          <div>
            <Code
              output={event => setCard(event.target.value)}
              card={card}
              dupliValue={""}
              valid={h_Valid}/>
            <button onClick={() => SubmitCardCheck()} disabled={check.card ? false : true}>Verificar Cartão</button>
            <button onClick={() => {setConfirmReset(true);SubmitCardCheck()}} disabled={check.card ? false : true}>Resetar Cartão</button>
          </div>
          {stands.length === 0 ?
          <div>Nenhum estande no banco de dados</div>
          :
          <ul>
            {stands.map((stand) => (
              <li key={stand.standID} 
                onClick={() => setSelectedID(stand.standID)}
              >
                {stand.stand}
              </li>
            ))}
          </ul>
          }
        </div>
        <div>
          {items.length === 0 ? 
          <div>Nenhum item no estande</div>
          :
          <ul>
            {items.map((item) => (
              <li key={item.itemID} 
                onClick={() => handleCart(item)}>
                <p>Name: {item.item}</p>
                <p>Price: R${item.price}</p>
                <p>Estoque: {item.stock}</p>
              </li>
            ))}
          </ul>
          }
        </div>
      </div>
      <div>
        <ul>
          {cart.map(item => (
            <li key={item.itemID}>
              <p>{item.item}</p>
              <p>{item.price}</p>
              <p>{item.amount}</p>
              <p onClick={() => handleRemoveCart(item.itemID)}>Remove</p>
            </li>
          ))}
        </ul>
        <div>
          <p>Subtotal: {sumAux}</p>
          <button onClick={() => setRecharge(recharge + sumAux)}>Adicionar</button>
          <button onClick={() => setRecharge(sumAux)}>Passar</button>
        </div>
        <p>Total:</p>
        <input
          type="number" id="recharge" name="recharge"
          value={recharge}
          onChange={event => setRecharge(event.target.value)}
        />
        <button type="submit" onClick={() => setConfirmRecharge(true)} disabled={check.recharge ? false : true}>Recarregar</button>
      </div>
      {confirmRecharge &&
      <div>
        <div>
          <p>{recharge}</p>
          <Code
            output={event => setCard(event.target.value)}
            card={card}
            dupliValue={""}
            valid={h_Valid}/>
          <button onClick={() => setConfirmRecharge(false)}>Cancelar</button>
          <button onClick={() => SubmitRecharge()} disabled={check.recharge && check.card ? false : true}>Confirmar</button>
        </div>
      </div>
      }
      {confirmReset &&
      <div>
        <div>
          <h3>Resetar cartão: {card}</h3>
          <p>saldo: {messageValue}</p>
          <Code
            output={event => setCard(event.target.value)}
            card={card}
            dupliValue={""}
            valid={h_Valid}/>
          <button onClick={() => setConfirmReset(false)}>Cancelar</button>
          <button onClick={() => SubmitReset()} disabled={check.card ? false : true}>Confirmar</button>
        </div>
      </div>
      }
      {message !== "" && !confirmReset &&
        <div>
          <div>
            <p>message</p>
            <div>
              {message}
              {messageValue}
            </div>
            <div>
              <button onClick={() => setMessage("")}>OK</button>
            </div>
          </div>
        </div>  
      }
    </div>
  )
}

export default Cashier