import "./Cashier.css"
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { CreditCard, Minimize2, Pause, RefreshCw, DollarSign, Package, Minus, Plus, ArrowDown, CheckCircle } from 'react-feather';
import AuthContext from '../../store/auth_context';
import Code from '../admin/inputs/Code';
import Payment from "./inputs/Payment";
import QRcodeScanner from "./inputs/QRcodeScanner";
import Barcode from "../../midia/Barcode";


function Cashier() {
  // Main
  const [recharge, setRecharge] = useState(0)
  const [payment, setPayment] = useState("cash")
  const [card, setCard] = useState("")
  const [check, setCheck] = useState({
    recharge: false,
    card: false})
  // Card
  const [showCard, setShowCard] = useState(true)
  const [cardBalance, setCardBalance] = useState(0)
  const [balanceType, setBalanceType] = useState("")
  const [customer, setCustomer] = useState("")
  // Scanner
  const [showScanner, setShowScanner] = useState(false)
  // Cart
  const [showCart, setShowCart] = useState(false)
  const [cart, setCart] = useState([])
  const [sumAux, setSumAux] = useState(0)
  // Items
  const [stands, setStands] = useState([]);
  const [selectedID, setSelectedID] = useState(0)
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  // Message
  const [confirmRecharge, setConfirmRecharge] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  // Aux to css
  const [animation, setAnimation] = useState(false)
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
          "cardID": card,
          "payment": payment
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            RequestLists()
            setRecharge(0); setShowCard(true);
            setConfirmRecharge(false); setCheck({recharge: false, card: false})
            SubmitCardCheck()
            return setTimeout(() => {
              setCard("");
              setCart([]);
            }, 4000);
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch((error) => {
          console.error(error.message);
        })
    }
  }

  async function SubmitReset(type) {  // Submit the recharge
    if (auth.user.authenticated && cardBalance !== "invalid") {
      var resStatus;
      fetch("/api/resetcard", {  // Post form
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "cardID": card,
          "finalization": type
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            RequestLists()
            setRecharge(0); setShowCard(true);
            setConfirmReset(false); setCheck({recharge: false, card: false}); setCardBalance(0)
            return setTimeout(() => {
              setShowCard(false);
              setCard("")
            }, 4000);
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch((error) => {
          console.error(error.message);
        })
    }
  }

  async function SubmitCardCheck(auxvalue = "") {
    fetch("/api/cardcheck", {  // Post form
      method: "POST", headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"cardID": (auxvalue === ""? card : auxvalue)})
    })
    .then(res => res.json())
    .then(data => {
      if (data.code){
        setBalanceType(data.payment)
        setCustomer(data.customer)
        return setCardBalance(parseFloat(data.value))
      } else {
        return setCardBalance("invalid")
      }
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

  useEffect(() => {  // Check card
    if (card.length === 12){
      setCheck(check => ({...check, card: true}));
      SubmitCardCheck();
    }
  }, [card])
  
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

  const handleScan = (value) => {  // Take result of scanner
    setCard(value);
    setShowScanner(false);
  };

  function handleCart(item) {  // Add item on cart
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

  function handleEditCartItem(itemID, field, value) {  // Edit item from cart
    const item = items.find(item => item.itemID === itemID);
    if (!item) {
      return;
    }
    let newValue = value;
    if (field === 'amount') {
      newValue = Math.min(value, item.stock);
    }

    const updatedCart = cart.map(element => {
      if (element.itemID === itemID) {
        return { ...element, [field]: newValue };
      } else {
        return element; // return other items
      }
    });
    setCart(updatedCart);
  }

  function handleCard(event){
    setCard(event.target.value)
  }

  function handleRecharge(event, key = 0){
    if(key === 0){
      if (isNaN(event.target.value) || event.target.value === "" || event.target.value === "0"){
        return setRecharge(0);
      }
      let num = event.target.value;
      num = num.toString();
      num = num.replace(/^0+/, '')
      num = num.replace(".", "")
      num = parseFloat(num);
      num = (num/100).toFixed(2);
      setRecharge(num);
    }else if(key === 1){
      if (isNaN(recharge) || recharge === 0){
        return setRecharge(0 + sumAux);
      }
      setRecharge(recharge + sumAux)
    }else if(key ===2){
      setRecharge(sumAux)
    }
  }

  function h_Valid(value) {  // Card valid
    setCheck(check => ({...check, card: value}))
    if (value) {
      SubmitCardCheck()
    }
  };

  return (
    <div className="Cashierbackground">
      <div className="CashierMain">
        <div className="CashierMenu">
          {showCard?
          <div className={`CashierCard ${(check.card === true && cardBalance === "invalid")? "noUse" : "" } ${animation? "animation" : ""}`}>
            <div className="CashierCardHead">
              <div className="CashierCardNumber">
                <button onClick={() => setShowScanner(true)}><Barcode/></button>
                <Code
                  output={handleCard}
                  card={card}
                  dupliValue={""}
                  valid={h_Valid}/>
              </div>
              <button onClick={() => setShowCard(false)}><Minimize2/></button>
            </div>
              {(cardBalance === "invalid" && check.card) ?
                <div className="CashierCardMainInvalid">
                  <h3>Cartão Inválido</h3>
                </div>
              :(check.card) ?
                <div className="CashierCardMain">
                  <DollarSign size={19}/><h3>{parseFloat(cardBalance).toFixed(2)}</h3>
                </div>
              :
                <div className="CashierCardMain">
                </div>
              }
            <div className="CashierCardFooter">
              {cardBalance !== "invalid" && check.card ? (customer === 1 ? 
                (balanceType === "cash" ? <p>Dinheiro</p> : balanceType === "debit" ? <p>Débito</p> : balanceType === "credit" && <p>Crédito</p>)
                : customer === 0 && <Pause/>) : <div/>}
              <button onClick={() => {setConfirmReset(true);SubmitCardCheck(); setShowCard(false)}} disabled={check.card && cardBalance !== "invalid" && customer === 1 ? false : true}>
                <RefreshCw/>
              </button>
            </div>
          </div>
          :
          <div className={`CashierCardCompact ${(check.card === true && cardBalance === "invalid")? "noUse" : "" }`}>
            <button onClick={() => {setShowCard(true); setAnimation(true)}}><CreditCard/></button>
          </div>
          }
          {stands.length === 0 ?
          <div className="CashierStandsEmpty"><p>Nenhum estande no banco de dados</p></div>
          :
          <ul>
            {stands.map((stand) => (
              <li className={`CashierStand${stand.standID === selectedID ? " Selected" : ""}`} key={stand.standID} onClick={() => setSelectedID(stand.standID)}>
                {stand.stand}
              </li>
            ))}
          </ul>
          }
        </div>
        <div className="CashierItems">
          {selectedID !== 0 ? (items.length !== 0 ? 
          <ul className={`${showCard && "cardExpanded"}`}>
            {items.map((item) => (
              <li className={`${item.stock === 0 && "unavailable"}`}  key={item.itemID} onClick={() => handleCart(item)}>
                <p id="name">{item.item}</p>
                <p id="price"><DollarSign size={19}/>{item.price}</p>
                <p id="stock"><Package size={19}/>{item.stock}</p>
              </li>
            ))}
          </ul>
          :
          <div className="CashierItemsEmpty"><p>Nenhum item no estande</p></div>)
          :
          <div className="CashierItemsEmpty"><p>Selecione um estande</p></div>
          }
        </div>
      </div>
      <div className="CashierFooter">
        <div className="CashierList">
          {(showCart && cart.length > 0) &&
          <>
            <div className="CashierCartToggle" onClick={() => {setShowCart(false)}}/> 
            <ul>
              {cart.map(item => (
                <li key={item.itemID}>
                  <p id="name" onClick={() => handleEditCartItem(item.itemID, 'amount', (item.amount + 1))}>{item.item}</p>
                  <p id="price"><DollarSign size={18}/>{item.price}</p>
                  <div id="amount">
                    <Plus size={19} onClick={() => handleEditCartItem(item.itemID, 'amount', (item.amount + 1))}/>
                    <p id="amount">{item.amount}</p>
                    <Minus size={19} onClick={() => handleRemoveCart(item.itemID)}/>
                  </div>
                </li>
              ))}
            </ul>
          </>
          }
          <div className="CashierAux">
            {cart.length > 0 ?
            <>
              <p>Carrinho: </p>
              <p id="SumAux" onClick={() => {setShowCart(true)}}><DollarSign size={18}/>{sumAux}</p>
            </>
            :
            <>
              <p>Carrinho:</p>
              <p id="SumAux"><DollarSign size={18}/>{parseFloat(sumAux).toFixed(2)}</p>
            </>
            }
            <div className="CashierAuxButtons">
              <button onClick={() => handleRecharge(1,1)} disabled={sumAux !== 0 ? false : true}><Plus/></button>
              <button onClick={() => handleRecharge(1,2)} disabled={sumAux !== 0 ? false : true}><ArrowDown/></button>
            </div>
          </div>
        </div>
        <div className="CashierTotal">
          <p>Total:</p>
          <div className="CashierTotalInput">
            <DollarSign size={20}/>
            <input
              type="number" inputMode="numeric" id="recharge" name="recharge"
              value={parseFloat(recharge).toFixed(2)}
              onChange={handleRecharge}
            />
          </div>
          <button type="submit" onClick={() => {setConfirmRecharge(true); setShowCard(false)}} disabled={check.recharge ? false : true}><CheckCircle size={20}/></button>
        </div>
      </div>

      {confirmRecharge &&
      <>
      <div className="BlackBackground" onClick={() => setConfirmRecharge(false)}/>
      <div className="CashierRecharge">
        <h3>Recarregar Cartão</h3>
        <div className={`CashierCardMini  ${(check.card === true && cardBalance === "invalid")? "noUse" : ""}`}>
          <div  className="CashierCardMiniCode">
            <button onClick={() => setShowScanner(true)}><Barcode/></button>
            <Code
              output={handleCard}
              card={card}
              dupliValue={""}
              valid={h_Valid}/>
          </div>
          <div className="CashierCardMiniBalance">
            {check.card &&
              (cardBalance !== "invalid"?
                <p><DollarSign size={18}/>{cardBalance}</p>
              :
                <p>{cardBalance}</p>
              )
            }
          </div>
        </div>
        <div className="CashierRechargeFooter">
          <p>Recarregar</p>
          <p id="recharge"><DollarSign size={20}/>{parseFloat(recharge).toFixed(2)}</p>
          <Payment 
            output={(value) => setPayment(value)}/>
          <div className="CashierRechargeFooterButtons">
            <button onClick={() => setConfirmRecharge(false)}>Cancelar</button>
            <button onClick={() => SubmitRecharge()} disabled={check.recharge && check.card && cardBalance !== "invalid"? false : true}>Confirmar</button>
          </div>
        </div>
      </div>
      </>
      }

      {confirmReset &&
      <>
      <div className="BlackBackground" onClick={() => setConfirmReset(false)}/>
      <div className="CashierReset">
        <h3>Finalizar Cartão</h3>
        <div className="CashierCardMini">
          <div  className="CashierCardMiniCode">
            <button onClick={() => setShowScanner(true)}><Barcode/></button>
            <Code
              output={handleCard}
              card={card}
              dupliValue={""}
              valid={h_Valid}/>
          </div>
          <div className="Balance">
            {check.card &&
              (cardBalance !== "invalid"?
                <>
                <p><DollarSign size={18}/>{parseFloat(cardBalance).toFixed(2)}</p>
                {balanceType === "cash" ? <p>Dinheiro</p> : balanceType === "debit" ? <p>Débito</p> : balanceType === "credit" && <p>Crédito</p>}
                </>
              :
                <p>{cardBalance}</p>
              )
            }
          </div>
        </div>
        <div className="CashierResetFooter">
          <button onClick={() => setConfirmReset(false)}>Cancelar</button>
          {cardBalance === 0 ?
            <button onClick={() => SubmitReset("refund")} disabled={check.card ? false : true}>Confirmar</button>
          : balanceType === "cash" ?
          <>
            <button onClick={() => SubmitReset("donation")} disabled={check.card ? false : true}>Doar</button>
            <button onClick={() => SubmitReset("refund")} disabled={check.card ? false : true}>Reenbolsar</button>
          </>
          :
            <button onClick={() => SubmitReset("donation")} disabled={check.card ? false : true}>Doar</button>
          }
          
        </div>        
      </div>
      </>
      }

      {showScanner &&
      <div className="BlackBackgroundScanner" onClick={() => {setShowScanner(false)}}>
        <div className="ScanPreview">
          <QRcodeScanner output={handleScan}/>
        </div>
      </div>
      }
    </div>
  )
}

export default Cashier