import './Statistics.css'
import React, { useState, useEffect, useContext } from 'react'
import { Hash, Award, Clock, User, CreditCard, Tag, Image, DollarSign, ShoppingBag } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth_context';

function Statistics() {
  const [sales, setSales] = useState([])
  const [goods, setGoods] = useState([])
  const [stands, setStands] = useState([])
  const [items, setItems] = useState([])
  const [recharges, setRecharges] = useState([])
  const [donations, setDonations] = useState([])
  const [customers, setCustomers] = useState([])
  const [show, setShow] = useState("sales")
  const [showGoods, setShowGoods] = useState(false)
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {  // Page requirements
    if (auth.user.authenticated === true && auth.user.superuser) {
      RequestSales()
      RequestCards()
    } else if (auth.user.authenticated === false) {
      navigate('/login');
    } else if (auth.user.authenticated === true && !auth.user.superuser){
      navigate('/')
    }
  }, [auth, navigate])

  async function RequestSales() {  // List all stand and associations
    var resStatus;
    fetch('/api/listsales')
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200){
          setStands(data.stands)
          setItems(data.items)
          const options = {
            timeZone: 'America/Sao_Paulo',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          };
          if (data.sales.length > 0) {
            data.goods.forEach((good) => {
              good.subtotal = good.quantity * good.unit_p;
            })
            data.sales.forEach((sale) => {
              const dateObj = new Date(sale.sale_t);
              const formattedDate = dateObj.toLocaleString('pt-BR', options);
              sale.sale_t = formattedDate;
              sale.total = data.goods.reduce((acc, item) => (item.saleID === sale.saleID ? acc + item.subtotal : acc), 0);
            })
          }
          setSales(data.sales)
          return setGoods(data.goods) 
        } else if (resStatus === 401){
          return auth.onLogout()
        }
      })
  }

  async function RequestCards() {  // List all stand and associations
    var resStatus;
    fetch('/api/listrecharges')
      .then(res => {resStatus = res.status; return res.json()})
      .then(data => {
        if (resStatus === 200){
          // console.log(data.recharges)
          // console.log(data.customers)

          setRecharges(data.recharges)
          setCustomers(data.customers)
          return setDonations(data.donations)
        } else if (resStatus === 401){
          return auth.onLogout()
        }
      })
  }

  return (
    <div className="Statistics">
      <div className="Title">
        <div className="Menu">
          <h1>Estatística</h1>
          <button onClick={() => setShow("sales")}>Todas as vendas</button>
        </div>
      </div>
      <div className="Main">
        {show === "geral" &&
          <p>Nenhuma venda realizada</p>
        }
        {show === "sales" &&
        <div className="ListSales">
          <ul>
            <li id="header">
              <p id="ID"><Hash/>ID</p>
              <p id="stand"><Award/>Estande</p>
              <p id="hour"><Clock/>Horário</p>
              <p id="user"><User/>Usuário</p>
              <p id="card"><CreditCard/>Cartão</p>
              <p id="total"><DollarSign/>Total</p>
              <p id="items"><Tag/>Itens</p>
            </li>
            {sales.length !== 0 ? sales.map((sale) => (
            <li key={sale.saleID}>
              <p id="ID"><Hash/>{sale.saleID}</p>
              <p id="stand"><Award/>{sale.stand}</p>
              <p id="hour"><Clock/>{sale.sale_t}</p>
              <p id="user"><User/>{sale.userID}</p>
              <p id="card"><CreditCard/>{sale.cardID}</p>
              <p id="total"><DollarSign/>{sale.total}</p>
              <p id="items" onClick={() => setShowGoods(sale)}><Tag/>Itens</p>
            </li>
            ))
            :
            <li>
              <p>Nenhuma venda realizada</p>
            </li>
            }
          </ul>
        </div>
        }
      </div>

      {showGoods &&
      <>
        <div className="BlackBackground" onClick={() => setShowGoods(false)}/>
        <div className="ListGoods">
          <div className="Header">
            <h2><Hash/>{showGoods.saleID}</h2>
            <h3><Award/>{showGoods.stand}</h3>
          </div>
          <div className="Hour">
            <h2><Clock/>{showGoods.sale_t}</h2>
            <h3><User/>{showGoods.userID}</h3>
          </div>
          <div className="List">
            <ul>
              <li id="header">
                <p id="card"><CreditCard/>{showGoods.cardID}</p>
                <p id="total"><DollarSign/>{showGoods.total}</p>
              </li>
              <li id="header">
                <p id="ID"><Hash/>ID</p>
                <p id="item">
                  <div className="ImageIcon">
                    <Tag/>
                  </div>
                  Item
                </p>
                <div className="Price">
                  <p id="quantity"><ShoppingBag/>Quantidade</p>
                  <p id="price"><DollarSign/>Preço</p>
                </div>
                <p id="subtotal"><DollarSign/>SubTotal</p>
              </li>
              {goods.filter((good) => (good.saleID === showGoods.saleID)).map((good) => (
              <li key={good.itemID}>
                <p id="ID"><Hash/>{good.itemID}</p>
                <p id="item">
                  {good.item_img !== null ?
                    <img alt={good.item} src={`/api/itemimages/${good.itemID}.${good.item_img}`}/>
                  :
                  <div className="ImageIcon">
                    <Image/>
                  </div>
                  }{good.item}
                </p>
                <div className="Price">
                  <p id="quantity"><ShoppingBag/>{good.quantity}</p>
                  <p id="price"><DollarSign/>{good.unit_p}</p>
                </div>
                <p id="subtotal"><span><DollarSign/>{good.subtotal}</span></p>
              </li>
              ))}
            </ul>
          </div>
        </div>
      </>
      }
    </div>
  )
}

export default Statistics