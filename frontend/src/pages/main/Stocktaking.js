import "./Stocktaking.css"
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate  } from 'react-router-dom';
import { DollarSign, Package, ShoppingBag, Square } from 'react-feather';
import AuthContext from '../../store/auth_context';
import Item from './inputs/Item';
import StandID from '../admin/inputs/StandID';

function Stocktaking() {
  const [items, setItems] = useState([])
  const [stand, setStand] = useState({standID: 0,stand:""})
  const [stands, setStands] = useState([])
  const [associations, setAssociations] = useState([])
  // New item
  const [showItem, setShowItem] = useState(false)
  const [edit, setEdit] = useState(false)
  const [newItem, setNewItem] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [newStock, setNewStock] = useState("")
  const [itemID, setItemID] = useState(0)
  const [filter, setFilter] = useState(0)
  const [alreadyUsedI, setAlreadyUsedI] = useState("")
  const [selectedImage, setSelectedImage] = useState()
  const [check, setCheck] = useState({
    item: false,
    standID: false})
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {  // Page requirements
    if (auth.user.authenticated === true) {
      RequestItems()
    } else if (auth.user.authenticated === false) {
      navigate('/login');
    }
  }, [auth, navigate])

  async function RequestItems() {  // List all itens from stand
    var resStatus;
    if (auth.user.superuser) {
      fetch('/api/stocktakingall')
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200){
          RequestStands()
          return RequestSalesGoods("", true, data.items)
        } else if (resStatus === 401){
          return auth.onLogout()
        }
      })
    } else {
      fetch('/api/stocktaking')
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200){
          if (data.stand === null) {
            return navigate('/')
          }
          setStand(data.stand)
          return RequestSalesGoods(data.stand.standID, false, data.items)
        } else if (resStatus === 401){
          return auth.onLogout()
        }
      })
    }
  }

  async function RequestStands() {  // List all stands
    var resStatus;
    fetch('/api/liststand')
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200){
          setAssociations(data.associations);
          return setStands(data.stands);
        } else if (resStatus === 401){
          return auth.onLogout()
        }
      })
  }

  async function RequestSalesGoods(standID, permition, getitems) {  // List all stands
    var resStatus;
    if (permition) {
      fetch('/api/salesitems')
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            // return setGoods(data.goods);
            const mergedItems = getitems.map((item) => {
              const foundGood = data.goods.find((good) => good.itemID === item.itemID);
              return {
                ...item,
                sold: foundGood ? foundGood.totalQuantity : 0,
                totalPrice: foundGood ? foundGood.totalPrice : 0,
              };
            });
            setItems(mergedItems)
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
    } else {
      fetch('/api/salesitemsperstand', {
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "standID": standID
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            const mergedItems = getitems.map((item) => {
              const foundGood = data.goods.find((good) => good.itemID === item.itemID);
              return {
                ...item,
                totalQuantity: foundGood ? foundGood.totalQuantity : 0,
                totalPrice: foundGood ? foundGood.totalPrice : 0,
              };
            });
            setItems(mergedItems)
            // return setGoods(data.goods);
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
    }  
  }

  async function SubmitNewItem() {  // Submit new item
    if (stand.standID > 1) {
      var resStatus;
      fetch('/api/newitem', {
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "item": newItem,
          "price": newPrice,
          "stock": newStock,
          "standID": stand.standID
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            RequestItems();
            setShowItem(false); setCheck(check => ({...check, item: false}));
            setNewItem(""); setNewPrice(0); setNewStock(0);
            // LATER IT'S NEED submit the image in sequence
          } else if (resStatus === 409) {
            return setAlreadyUsedI(data.value)
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
    } else {
      RequestItems()
    }
  }

  async function SubmitEditItem() {  // Edit Item
    if (itemID !== 0) {
      var resStatus;
      fetch('/api/edititem', {
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "itemID": itemID,
          "item": newItem,
          "price": newPrice,
          "stock": newStock,
          "standID": stand.standID
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            RequestItems();
            setShowItem(false); setCheck(check => ({...check, item: false})); setEdit(false);
            setNewItem(""); setNewPrice(0); setNewStock(0);
            // LATER IT'S NEED submit the image in sequence
          } else if (resStatus === 409) {
            return setAlreadyUsedI(data.value)
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
    }
  }

  // async function submitImage{} {
  //   var resStatus;
  // }
  
  function handleChange(event) {  // Handle Change
    if (event.target.id === "item") {  // Item
      setNewItem(event.target.value)
    } else if (event.target.id === "price") {  // Price
      setNewPrice(event.target.value);
    } else if (event.target.id === "stock") {  // Stock
      setNewStock(event.target.value);
    }
  };
  function handleChangeStandID(value) {  // Manage stand ID
    const aux = parseInt(value)
    if (aux === 0) {
      setStand(stand => ({...stand, standID: null}))
    } else {
      setStand(stand => ({...stand, standID: aux}))
    }
  }
  function handleImage(event) {
    setSelectedImage(event.target.value)
  }
  function h_Valid(value) {
    setCheck(check => ({...check, item: value}))
  };

  return (
    <div className="ST_background">
      <div className="ST_Header">
        <h1>Inventário{stand.stand}</h1>
        <div className="ST_Menu">
          <button onClick={() => {setShowItem(true)}}>Novo item</button>
          <div className="Filtro">
            <h3>filtro</h3>
            <select value={filter} onChange={event => setFilter(parseInt(event.target.value))} id="filter" name="filter">
              <option key={0} value={0}>Todos</option>
              {stands.lenght !== 0 && stands.filter(item => item.standID !== 1).map((element) =>  (
                <option key={element.standID} value={element.standID}>{element.stand}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="ST_Main">
        <ul>
          {auth.user.superuser ? (items.lenght !== 0 && items.filter(item => {
            if (filter === 0){
              return true;
            } else {
              return item.standID === filter;
            }
          }).map((item) => (
            <li key={item.itemID} onClick={() => {
              setItemID(item.itemID);
              setShowItem(true); setEdit(true);
              setNewItem(item.item); setStand(stand => ({...stand, standID: item.standID}));
              setNewPrice(parseFloat(item.price));
              setNewStock(parseInt(item.stock));}}>
              <p id="name">{item.item}</p>
              <p id="price"><DollarSign size={18}/>{item.price}</p>
              <div className="quantity">
                <p id="stock"><Package size={18}/>{item.stock}</p>
                <p id="sold"><ShoppingBag size={18}/>{item.sold}</p>
              </div>
              <p id="total"><DollarSign id="dollar" size={15}/><Square size={18}/>{item.totalPrice}</p>
            </li>
          )))
          : (items.lenght !== 0 && items.map((item) => (
            <li key={item.itemID} onClick={() => {
              setItemID(item.itemID);
              setShowItem(true); setEdit(true);
              setNewItem(item.item);
              setNewPrice(parseFloat(item.price));
              setNewStock(parseInt(item.stock));}}>
              <p id="name">{item.item}</p>
              <p id="price"><DollarSign size={18}/>{item.price}</p>
              <div className="quantity">
                <p id="stock"><Package size={18}/>{item.stock}</p>
                <p id="sold"><ShoppingBag size={18}/>{item.sold}</p>
              </div>
              <p id="total"><DollarSign id="dollar" size={15}/><Square size={18}/>{item.totalPrice}</p>
            </li>
          )))}
        </ul>
      </div>

      {showItem &&
      <>
        <div className="BlackBackground" onClick={() => {setShowItem(false); setEdit(false)}}/>
        <div className="ST_NewItem">
          {edit?
            <h3>Editar</h3>
          :
            <h3>Criar</h3>
          }
          <Item
            output={handleChange}
            item={newItem}
            price={newPrice}
            stock={newStock}
            dupliValue={alreadyUsedI}
            valid={h_Valid}/>
          {auth.user.superuser &&
            <StandID
              output={handleChangeStandID}
              associations={associations}
              stands={stands}
              valid={value => setCheck(check => ({...check, standID: value}))}
              defaultValue={stand.standID}/>
          }
          {/* {selectedImage &&
            <img src={URL.createObjectURL(selectedImage)}/>  
          }
          <input type="file" value={selectedImage} onChange={handleImage}/> */}
          {!edit ?
            <button onClick={() => (SubmitNewItem())} disabled={check.item && check.standID ? false : true}>Criar Item</button>
          :
            <button onClick={() => (SubmitEditItem())} disabled={check.item && check.standID? false : true}>Editar Item</button>
          }  
        </div>
      </>
      }
    </div>
  )
}

export default Stocktaking