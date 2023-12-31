import "./Stocktaking.css"
import React, { useState, useEffect, useRef, useContext } from 'react'
import { useNavigate  } from 'react-router-dom';
import { Plus, Image, DollarSign, Package, ShoppingBag, Crop, X, Check } from 'react-feather';
import { ResizeImg } from './inputs/utils.js';
import AuthContext from '../../store/auth_context';
import Item from './inputs/Item';
import CropImage from "./inputs/CropImage";
import StandID from '../admin/inputs/StandID';

function Stocktaking() {
  const [user, setUser] = useState({
    standID: 0,
    superuser: false,
  })

  const [items, setItems] = useState([])
  const [stand, setStand] = useState({standID: 0,stand:""})
  const [stands, setStands] = useState([])
  const [associations, setAssociations] = useState([])
  const [filter, setFilter] = useState(0)
  // New item
  const [showItem, setShowItem] = useState(false)
  const [edit, setEdit] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [newItem, setNewItem] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [newStock, setNewStock] = useState("")
  const [itemID, setItemID] = useState(0)
  // Image
  const [selectedImage, setSelectedImage] = useState()
  const [selectedImageURL, setSelectedImageURL] = useState()
  const [showCrop, setShowCrop] = useState(false)
  // Check and Results
  const [alreadyUsedItem, setAlreadyUsedItem] = useState("")
  const [check, setCheck] = useState({
    item: false,
    standID: false})
  const [message, setMessage] = useState("")

  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const hiddenFileInput = useRef(null);

  useEffect(() => {  // Page requirements
    if (auth.user.authenticated === true && user.standID === 0) {
      var resStatus;
      fetch("/api/main")
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            RequestItems(data.standID)
            return setUser(data)
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch(console.error)
    }
    if (auth.user.authenticated === true) {
      
    } else if (auth.user.authenticated === false) {
      navigate('/login');
    }
  }, [auth, navigate, user.standID])

  useEffect(() => {  // Page requirements
    
  }, [auth, ])

  async function RequestItems(standID = user.standID) {  // List all itens from stand
    var resStatus;
    if (auth.user.superuser || standID === 2) {
      fetch('/api/stocktakingall')
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200){
          RequestStands()
          // console.log('items', data.items)
          // console.log("goods", data.goods)
          const mergedItems = data.items.map((item) => {
            const foundGood = data.goods.find((good) => good.itemID === item.itemID);
            return {
              ...item,
              sold: foundGood ? foundGood.totalQuantity : 0,
            };
          });
          setItems(mergedItems)
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
          setCheck(check => ({...check, standID: true}))
          const mergedItems = data.items.map((item) => {
            const foundGood = data.goods.find((good) => good.itemID === item.itemID);
            return {
              ...item,
              sold: foundGood ? foundGood.totalQuantity : 0,
            };
          });
          setItems(mergedItems)
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

  async function SubmitNewItem() {  // Submit new item
    if (stand.standID > 2) {
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
            if (selectedImage) {
              SubmitImage(data.ID)
            } else {
              RequestItems();
              setShowItem(false); setCheck(check => ({...check, item: false}));
              setNewItem(""); setNewPrice(""); setNewStock("");
              setAlreadyUsedItem("");setMessage("");
            }
          } else if (resStatus === 409) {
            return setAlreadyUsedItem(data.value)
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
            if (selectedImage) {
              SubmitImage(itemID);
            } else {
              RequestItems();
              setShowItem(false); setCheck(check => ({...check, item: false})); setEdit(false);
              setNewItem(""); setNewPrice(""); setNewStock("");
              setAlreadyUsedItem("");setMessage("");
            }
          } else if (resStatus === 409) {
            return setAlreadyUsedItem(data.value)
          } else if (resStatus === 406){
            return setMessage("Esse Item não pode mudar de estande, já vendas com esse item")
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
    }
  }

  async function SubmitDeleteItem() {  // Delete Item
    if (itemID !== 0) {
      var resStatus;
      fetch('/api/deleteitem', {
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "itemID": itemID,
          "item": newItem,
          "standID": stand.standID
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            if (selectedImage) {
              SubmitImage(itemID);
            } else {
              RequestItems();
              setShowItem(false); setCheck(check => ({...check, item: false})); setEdit(false);
              setNewItem(""); setNewPrice(""); setNewStock("");
              setAlreadyUsedItem("");setMessage("");
            }
          } else {
            return setMessage("Erro")
          }
        })
    }
  }

  async function SubmitImage(name) {
    var resStatus;
    const formData = new FormData();
    const resizedImg = await ResizeImg(selectedImage, 300)
    formData.append('imageName', name);
    formData.append('standID', stand.standID)
    formData.append('imageType', resizedImg.type)
    formData.append('imageItem', resizedImg);
    fetch('/api/itemimageupload', {
      method: 'POST',
      body: formData,
    })
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200){
          setSelectedImage();
          setSelectedImageURL();
          RequestItems();
          setShowItem(false); setCheck(check => ({...check, item: false})); setEdit(false);
          setNewItem(""); setNewPrice(0); setNewStock(0);
        } else if (resStatus === 401){
          return auth.onLogout()
        }
      })
  }
  
  function handleClick(event) {  // Click the hidden file input element
    hiddenFileInput.current.click();
  };

  function handleChange(event) {  // Handle Change inputs from item
    if (event.target.id === "item") {  // Item
      setNewItem(event.target.value);
    } else if (event.target.id === "price") {  // Price
      if (isNaN(event.target.value) || event.target.value === 0){
        return setNewPrice(0);
      }
      let num = event.target.value;
      num = num.toString();
      num = num.replace(/^0+/, '')
      num = num.replace(".", "")
      num = parseFloat(num);
      num = (num/100).toFixed(2);
      setNewPrice(num);
    } else if (event.target.id === "stock") {  // Stock
      setNewStock(event.target.value);
    }
  };

  function handleChangeStandID(value) {  // Manage stand ID
    const aux = parseInt(value)
    if (aux === 0) {
      setStand(stand => ({...stand, standID: null}));
    } else {
      setStand(stand => ({...stand, standID: aux}));
    }
  };

  function handleImage(event) {  // Handle Change input image
    setSelectedImage(event.target.files[0]);
    setSelectedImageURL(URL.createObjectURL(event.target.files[0]));
    setShowCrop(true);
  };

  function h_Valid(value) {
    setCheck(check => ({...check, item: value}));
  };

  return (
    <div className="ST_background">
      <div className="ST_Header">
        {auth.user.superuser === 1 ?
          <h2>Inventário Geral</h2>
        :
          <h2>Inventário: {stand.stand}</h2>
        }
        {auth.user.superuser === 1 &&
        <div className="ST_Menu">
          <button onClick={() => {setShowItem(true)}}><Plus size="24"/></button>
            <div className="Filtro">
              <h3>Filtro </h3>
              <select value={filter} onChange={event => setFilter(parseInt(event.target.value))} id="filter" name="filter">
                <option key={0} value={0}>Todos</option>
                {stands.length !== 0 && stands.filter(item => item.standID > 2).map((element) =>  (
                  <option key={element.standID} value={element.standID}>{element.stand}</option>
                ))}
              </select>
            </div>
        </div>
        }
      </div>
      <div className="ST_Main">
        <ul>
          {auth.user.superuser ? (items.filter(item => {
            if (filter === 0){
              return true;
            } else {
              return item.standID === filter;
            }
          }).length !== 0 ? (items.filter(item => {
            if (filter === 0){
              return true;
            } else {
              return item.standID === filter;
            }
          }).map((item) => (
            <li key={item.itemID} className={`${item.activated !== 1 ? "deleted" : ""}`} onClick={() => {
              setItemID(item.itemID);
              setShowItem(true); setEdit(true);
              setNewItem(item.item); setStand(stand => ({...stand, standID: item.standID}));
              setNewPrice(item.price.toFixed(2));
              setNewStock(parseInt(item.stock));}}>
              {item.item_img !== null?
                <img alt={item.item} src={`/api/itemimages/${item.itemID}.${item.item_img}`}/>
              :
              <div className="ImageIcon">
                <Image/>
              </div>
              }
              <p id="name">{item.item}</p>
              <p id="price"><DollarSign size={18}/>{item.price.toFixed(2)}</p>
              <div className="quantity">
                <p id="stock" className={`${item.stock === 0 && "unavailable"}`}><Package size={18}/>{item.stock}</p>
                <p id="sold"><ShoppingBag size={18}/>{item?.sold}</p>
              </div>
            </li>
          )))
          :
          <li><p>Nenhum Item</p></li> )
          : (items.length !== 0 ? (items.map((item) => (
            <li key={item.itemID}>
              {item.item_img !== null ?
                <img alt={item.item} src={`/api/itemimages/${item.itemID}.${item.item_img}`}/>
              :
              <div className="ImageIcon">
                <Image/>
              </div>
              }
              <p id="name">{item.item}</p>
              <p id="price"><DollarSign size={18}/>{item.price}</p>
              <div className="quantity">
                <p id="stock" className={`${item.stock === 0 && "unavailable"}`}><Package size={18}/>{item.stock}</p>
              </div>
            </li>
          ))): <li><p>Nenhum Item</p></li> )}
        </ul>
      </div>

      {showItem &&
      <>
        <div className="BlackBackground" 
          onClick={() => {
            setShowItem(false); setEdit(false);
            setNewItem("");setNewPrice("");setNewStock("");setItemID(0);
            setSelectedImage(); setSelectedImageURL()}}/>
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
            dupliValue={alreadyUsedItem}
            valid={h_Valid}/>
          <div className="Image">
            {selectedImageURL ?
              <img src={selectedImageURL}/>
              :
              <Image size="24"/>  
            }
          </div>
          <div className="ImageInput">
            <button className="button-upload" onClick={handleClick}><Image size="18"/></button>
            <input type="file" name="image" onChange={handleImage} ref={hiddenFileInput} style={{display: 'none'}}/>
            <button onClick={() => {setShowCrop(true)}} disabled={selectedImage ? false : true}><Crop size="18"/></button>
          </div>
          {auth.user.superuser === 1 &&
            <StandID
              output={handleChangeStandID}
              associations={associations}
              stands={stands}
              valid={(value) => setCheck(check => ({...check, standID: value}))}
              defaultValue={stand.standID}
              noCashier={true}/>
          }
          {message !== "" &&
            <p>{message}</p>
          }
          {confirmDelete ?
          <div className="ItemFooterDelete">
            <p>Excluir:</p>
            <button onClick={() => (setConfirmDelete(false))}>
              <X/>
            </button>
            <button onClick={()=> (SubmitDeleteItem())}>
              <Check/>
            </button>
          </div>
          :
          <div className="ItemFooter">
          <button onClick={() => {setMessage("");setAlreadyUsedItem("");
                                  setShowItem(false); setEdit(false);
                                  setNewItem("");setNewPrice("");setNewStock("");setItemID(0);
                                  setSelectedImage(); setSelectedImageURL()}}>
            Cancelar
          </button>
          {!edit ?
            <button onClick={() => {SubmitNewItem();setMessage("")}} disabled={check.item && check.standID ? false : true}>Confirmar</button>
          :
          <>
            <button onClick={() => (setConfirmDelete(true))}>Excluir</button>
            <button onClick={() => {SubmitEditItem()}} disabled={check.item && check.standID? false : true}>Confirmar</button>
          </>
          }
          </div>
          }
        </div>
      </>
      }
      {showCrop &&
      <>      
        <div className="BlackBackgroundScanner"/>
        <div className="ST_CropImage">
          <CropImage
            image={selectedImage}
            imageURL={selectedImageURL}
            setImageURL={(URL) => setSelectedImageURL(URL)}
            setImageFile={(file) => setSelectedImage(file)}
            setShow={() => setShowCrop(false)}/>
        </div>
      </>
      }
    </div>
  )
}

export default Stocktaking