import React, { useState, useEffect, useContext } from 'react'
import { useNavigate  } from 'react-router-dom';
import AuthContext from '../../store/auth_context';
import Item from './inputs/Item';

function Inventory() {
  const [items, setItems] = useState([])
  const [stand, setStand] = useState({standID:0 ,stand:""})
  const [showItem, setShowItem] = useState(false)
  const [newItem, setNewItem] = useState("")
  const [newPrice, setNewPrice] = useState(0)
  const [newStock, setNewStock] = useState(0)
  const [itemID, setItemID] = useState(0)
  const [selectedImage, setSelectedImage] = useState()
  const [alreadyUsedI, setAlreadyUsedI] = useState("")
  const [check, setCheck] = useState(false)
  const [edit, setEdit] = useState(false)
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {  // Load from pages
    if (auth.user.authenticated === true) {
      RequestItems()
    } else if (auth.user.authenticated === false) {
      navigate('/login');
    }
  }, [auth, navigate])

  async function RequestItems() {  // List all itens from stand
    var resStatus;
      fetch('/api/inventory')
        .then(res => {
          resStatus = res.status;
          return res.json()})
        .then(data => {
          if (resStatus === 200){
            setStand(data.stand)
            if (data.stand === null && !auth.user.superuser) {
              return navigate('/')
            }
            return setItems(data.items)
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
  }

  async function SubmitNewItem() {  // Submit new item
    if (stand.standID !== 0) {
      var resStatus;
      fetch('/api/newitem', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "item": newItem,
          "price": newPrice,
          "stock": newStock,
          "standID": stand.standID
        })
      })
        .then(res => {
          resStatus = res.status;
          return res.json()})
        .then(data => {
          if (resStatus === 200){
            RequestItems();
            setShowItem(false); setCheck(false);
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
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "itemID": itemID,
          "item": newItem,
          "price": newPrice,
          "stock": newStock
        })
      })
        .then(res => {
          resStatus = res.status;
          return res.json()})
        .then(data => {
          if (resStatus === 200){
            RequestItems();
            setShowItem(false); setCheck(false); setEdit(false);
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
  
  function h_Change(event) {  // Username conditions
    if (event.target.id === "item") {
      setNewItem(event.target.value)
    } else if (event.target.id === "price") {
      if (event.target.value === ""){
        return setNewPrice(parseFloat(0))
      }
      setNewPrice(parseFloat(event.target.value));
    } else if (event.target.id === "stock") {
      if (event.target.value === ""){
        return setNewStock(parseInt(0))
      }
      setNewStock(parseInt(event.target.value));
    }
  };
  function handleImage(event) {
    setSelectedImage(event.target.value)
  }
  function h_Valid(value) {
    setCheck(value)
  };

  return (
    <div>
      <h1>Inventário de {stand.stand}</h1>
      <div>
        <div>
          <button onClick={() => {setShowItem(true)}}>Novo item</button>
        </div>
      </div>
      <div>
        <ul>
          <li>
            <p>Item</p>
            <p>Preço</p>
            <p>Estoque</p>
          </li>
          {items.lenght !== 0 && items.map((item) => (
            <li key={item.itemID}>
              <p onClick={() => {
                setItemID(item.itemID);
                setShowItem(true);
                setEdit(true);
                setNewItem(item.item);
                setNewPrice(parseFloat(item.price));
                setNewStock(parseInt(item.stock));}}>{item.item}</p>
              <p>{item.price}</p>
              <p>{item.stock}</p>
            </li>
          ))}
        </ul>
      </div>
      {showItem &&
      <div>
        <div>
          <Item
            output={h_Change}
            item={newItem}
            price={newPrice}
            stock={newStock}
            dupliValue={alreadyUsedI}
            valid={h_Valid}/>
          {/* {selectedImage &&
            <img src={URL.createObjectURL(selectedImage)}/>  
          }
          <input type="file" value={selectedImage} onChange={handleImage}/> */}
          {!edit ?
            <button onClick={() => (SubmitNewItem())} disabled={check ? false : true}>Criar Item</button>
          :
            <button onClick={() => (SubmitEditItem())} disabled={check ? false : true}>Editar Item</button>
          }  
        </div>
      </div>
      }
    </div>
  )
}

export default Inventory