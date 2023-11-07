import './Seller.css'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { CreditCard, Minimize2, Play, Pause, Image, DollarSign, Package, Plus, Minus, ShoppingBag, ShoppingCart, Trash2 } from 'react-feather';
import AuthContext from '../../store/auth_context';
import Code from '../admin/inputs/Code'
import QRcodeScanner from './inputs/QRcodeScanner';
import Barcode from '../../midia/Barcode';
import History from '../../midia/History';

function Seller() {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [showScanner, setShowScanner] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [card, setCard] = useState("")
  const [stand, setStand] = useState({standID:0 ,stand:""})
  const [items, setItems] = useState([])
  const [check, setCheck] = useState({
    purchase: false,
    card: false})
  const [confirmPurchase, setConfirmPurchase] = useState(false)
  const [cardBalance, setCardBalance] = useState(0)
  const [customer, setCustomer] = useState("")
  const [showLastSales, setShowLastSales] = useState(false)
  const [listLastSales, setListLastSales] = useState([])
  const [listLastGoods, setListLastGoods] = useState([])
  const [checkLastCustomer, setCheckLastCustomer] = useState(false)
  const [animation, setAnimation] = useState(false)
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {  // Page requirements
    if (auth.user.authenticated === true) {
      RequestItemsPerStand()
    } else if (auth.user.authenticated === false) {
      navigate('/login');
    }
  }, [auth, navigate])

  useEffect(() => {
    if (card.length === 12){
      SubmitCardCheck()
    }
  }, [card])
  

  async function RequestItemsPerStand() {  // List all itens by stand
    var resStatus;
      fetch('/api/listitemsperstand')
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

  async function SubmitCardCheck() {  // Submit debit checker
    fetch("/api/cardcheck", {  // Post form
      method: "POST", headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({"cardID": card})
    })
    .then(res => res.json())
    .then(data => {
      if (data.code){
        setCustomer(data.customer)
        return setCardBalance(data.value)
      } else {
        return setCardBalance("invalid")
      }
    })
  }

  async function SubmitPurchase() {  // Submit the purchase
    if (auth.user.authenticated) {
      const filteredItems = items.filter(item => item.amount !== 0);
      if (filteredItems.length > 0){
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
              RequestItemsPerStand();
              setCart([]); setShowCard(true); setAnimation(true);
              setConfirmPurchase(false);
              SubmitCardCheck();
              return setTimeout(() => {
                setShowCard(false);
                setCard("")
                setCheck({purchase: false, card: false})
              }, 4000);
            } else if (resStatus === 401){
              return auth.onLogout()
            }
          })
          .catch((error) => {
            console.error(error.message);
          })
      } else {
        setCart([]);
        setConfirmPurchase(false);
        return setCheck(check => ({...check, purchase: false}))
      }
    }
  }

  async function RequestLastSales() {  // Request Lasts Sales
    var resStatus;
    fetch("/api/checklastsales")
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200){
          setListLastSales(data.sales)
          setListLastGoods(data.goods)
          return setCheckLastCustomer(data.customer)
        } else if (resStatus === 401){
          return auth.onLogout()
        }
      })
  }

  async function SubmitDeleteSale(saleID, cardID) {  // Submit delete last sale
    var resStatus;
    fetch("/api/deletesale", {  // Post form
      method: "POST", headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "saleID": saleID,
        "cardID": cardID
    })
    })
    .then(res => {resStatus = res.status; return res.json()})
    .then(data => {
      if (resStatus === 200){
        RequestItemsPerStand();
        setShowLastSales(false);
        setShowCard(true);
        setAnimation(true);
        RequestLastSales();
        SubmitCardCheck();
        return setTimeout(() => {
          setShowCard(false);
          setCard("")
        }, 4000);
      } else if (resStatus === 401){
        return auth.onLogout()
      }
    })
}

  useEffect(() => {  // Sum the total on cart
    const subtotal = cart.reduce((accumulator, element) => {
      return accumulator + (element.price * element.amount);
    }, 0);
    setTotal(subtotal);
  }, [cart])

  useEffect(() => {  // Set check to purchase
    if (cart.length > 0) {
      return setCheck(check => ({...check, purchase: true}))
    } else {
      return setCheck(check => ({...check, purchase: false}))
    }
  }, [cart])

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

  const handleScan = (value) => {  // Take result of scanner
    setCard(value)
    setShowScanner(false)
  };
  function handleCard(event){
    setCard(event.target.value)
  }

  function h_Valid(value) {  // Card valid
    setCheck(check => ({...check, card: value}))
  };

  return (
    <div className="Sellerbackground">
      <div className="SellerMain">
        <div className="SellerMenu">
          <div className={`SellerTitle ${!showCard && animation? "animation" : ""}`}>
            <h2>Estande: {stand.stand}</h2>
            {!showCard &&
              <div className={`SellerCardCompact ${(check.card === true && cardBalance === "invalid")? "noUse" : "" } ${animation? "animation" : ""}`}>
                <button onClick={() => {setShowCard(true); setAnimation(true)}}><CreditCard/></button>
              </div>
            }
          </div>
          {showCard &&
            <div className={`SellerCard ${(check.card === true && cardBalance === "invalid")? "noUse" : "" }`}>
              <div className="SellerCardHead">
                <div className="SellerCardNumber">
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
                  <div className="SellerCardMainInvalid">
                    <h3>Cartão Inválido</h3>
                  </div>
                :(check.card) ?
                  <div className="SellerCardMain">
                    <DollarSign size={19}/><h3>{parseFloat(cardBalance).toFixed(2)}</h3>
                  </div>
                :
                  <div className="SellerCardMain">
                  </div>
                }
              <div className="SellerCardFooter">
                {(cardBalance === "invalid" && check.card) ?
                  <></>
                : (check.card && customer === 1) ?
                  <Play/>
                : (check.card && customer === 0) ?
                  <Pause/>
                :
                  <></>
                }
              </div>
            </div>
            }
            <div className="SellerHistory">
              <button onClick={() => {setShowLastSales(true); RequestLastSales()}}><History/></button>
            </div>
        </div>
        <div className="SellerItems">
          <ul className={`${showCard && "cardExpanded"}`}>
            {items.map((item) => (
              <li key={item.itemID} className={`${item.stock === 0 && "unavailable"}`}>
                <div className="ItemImage" onClick={() => handleCart(item)}>
                  {item.item_img !== null ?
                    <img alt={item.item} src={`/api/itemimages/${item.itemID}.${item.item_img}`}/>
                  :
                    <Image/>
                  }
                </div>
                <div className="SellerItem" onClick={() => handleCart(item)}>
                  <p id="name">{item.item}</p>
                  <div className="SelletItemFooter">
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
        </div>
        <div className="SellerFooter">
          <p>Total:</p>
          <p id="total"><DollarSign size={20}/>{parseFloat(total).toFixed(2)}</p>
          <button onClick={() => {setConfirmPurchase(true); setShowCard(false)}} disabled={check.purchase ? false : true}><ShoppingCart/></button>
        </div>
      </div>


      {confirmPurchase &&
      <>
      <div className="BlackBackground" onClick={() => setConfirmPurchase(false)}/>
      <div className="SellerPurchase">
        <h3>Finalizar Compra</h3>
        <div className={`SellerCardMini  ${(check.card === true && cardBalance === "invalid")? "noUse" : ""}`}>
          <div  className="SellerCardMiniCode">
            <button onClick={() => setShowScanner(true)}><Barcode/></button>
            <Code
              output={handleCard}
              card={card}
              dupliValue={""}
              valid={h_Valid}/>
          </div>
          <div className="SellerCardMiniBalance">
          {check.card &&
              (cardBalance !== "invalid"?
                <p><DollarSign size={18}/>{parseFloat(cardBalance).toFixed(2)}</p>
              :
                <p>{cardBalance}</p>
              )
            }
          </div>
        </div>
        <div className="SellerPurchaseCart">
          <ul>
            {cart.map(item => (
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
          <p id="total"><DollarSign size={20}/>{parseFloat(total).toFixed(2)}</p>
        </div>
        <div className="SellerPurchaseFooter">
          <button onClick={() => setConfirmPurchase(false)}>Cancelar</button>
          <button onClick={() => SubmitPurchase()} disabled={(check.purchase && check.card && total <= cardBalance) ? false : true}>Confirmar</button>
        </div>
      </div>
      </>
      }

      {showLastSales &&
      <>
      <div className="BlackBackground" onClick={() => setShowLastSales(false)}/>
      <div className="SellerLastSales">
        <h3>Histórico de compra</h3>
        <p>Para desfazer ultima compra</p>
        <p>identifique o cartão</p>
        <div className={`SellerCardMini  ${(check.card === true && cardBalance === "invalid")? "noUse" : ""}`}>
          <div  className="SellerCardMiniCode">
            <button onClick={() => setShowScanner(true)}><Barcode/></button>
            <Code
              output={handleCard}
              card={card}
              dupliValue={""}
              valid={h_Valid}/>
          </div>
          <div className="SellerCardMiniBalance">
          {check.card &&
              (cardBalance !== "invalid"?
                <p><DollarSign size={18}/>{parseFloat(cardBalance).toFixed(2)}</p>
              :
                <p>{cardBalance}</p>
              )
            }
          </div>
        </div>
        <div className="SellerListLastSales">
          <ul className="ListLastSales">
          {listLastSales.map((sale) => (
            <li key={sale.saleID} className="ItemSale">
              <ul className="ListofGoods">
                {listLastGoods.filter(element => element.saleID === sale.saleID).map((good) => (
                  <li key={good.itemID} className="ItemGood">
                    {stand.standID === sale.standID ?
                      <p id="name">{items.filter(element => element.itemID === good.itemID)[0].item}</p>
                    :
                      <p id="itemID">{good.itemID}</p>
                    }
                    <p id="quantity"><ShoppingBag size={18}/>{good.quantity}</p>
                    <p id="price"><DollarSign size={18}/>{good.unit_p}</p>
                  </li>
                ))}
              </ul>
              {checkLastCustomer === sale.saleID ?
                <button id="discard" onClick={() => SubmitDeleteSale(sale.saleID, sale.cardID)} disabled={card === sale.cardID ? false : true}><Trash2/></button>
              :
                <p id="discard"><Trash2/></p>
              }
            </li>
          ))}
          </ul>
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

export default Seller