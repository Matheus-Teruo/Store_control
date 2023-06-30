import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth_context';
import Code from './inputs/Code';

function Cards() {
  const [cards, setCards] = useState([])
  const [showCard, setShowCard] = useState(false)
  const [newCardID, setNewCardID] = useState("")
  const [check, setCheck] = useState(false)
  const [filter, setFilter] = useState(0)
  const [alreadyUsed, setAlreadyUsed] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {  // Load from pages
    if (auth.user.authenticated === true && auth.user.superuser) {
      RequestLists()
    } else if (auth.user.authenticated === false) {
      navigate('/login');
    } else if (auth.user.authenticated === true && !auth.user.superuser){
      navigate('/')
    }
  }, [auth, navigate])
  
  async function RequestLists() {  // List all Cards
    var resStatus;
      fetch('/api/allcards')
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200){
            return setCards(data)
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
  }

  async function SubmitNewCard() {
    if (auth.user.authenticated) {
      var resStatus;
      fetch("/api/newcard", {  // Post form
        method: "POST", headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          "cardID": newCardID,
          "debit": 0
        })
      })
        .then(res => {resStatus = res.status; return res.json()})
        .then(data => {
          if (resStatus === 200) {
            RequestLists()
            setNewCardID("")
            setShowCard(false); setCheck(false); alreadyUsed(false)
          } else if (resStatus === 409) {
            setAlreadyUsed(data.value);
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch(console.error)
    }
  }
  function h_Change(event) {  // Card conditions
    if (event.target.id === "card"){  // Code
      setNewCardID(event.target.value);
    }
  };
  function h_Valid(value) {  // Card valid
    setCheck(value)
  };

  return (
    <div>
      <h1>Cartões</h1>
      <div>
        <h2>Menu</h2>
        <div>
          <h3>filtro</h3>
          <select value={filter} onChange={event => setFilter(event.target.value)} id="filter" name="filter">
            <option value={0}>Todos</option>
            <option value={1}>Cartões vazios</option>
            <option value={2}>Com crédito</option>
          </select>
        </div>
        <div>
          <button onClick={() => {setShowCard(true)}}>Registrar cartão</button>
        </div>
      </div>
      <div>
        <ul>
          <li><p>Código do Cartão</p><p>debito</p><p>Em uso</p></li>
          {cards.length !== 0 &&
          cards.filter(item => {
            if (filter === "1"){
              return item.debit === 0;
            } else if (filter === "2") {
              return item.debit !== 0;
            } else {
              return true
            }
          }).map((card) => (
            <li key={card.cardID}>
              <p>{card.cardID}</p>
              <p>{card.debit}</p>  
              <p>{card.in_use}</p>
            </li>  
          ))}
        </ul>
      </div>
      {showCard &&
      <div>
        <div>
          <Code
          output={h_Change}
          card={newCardID}
          dupliValue={alreadyUsed}
          valid={h_Valid}/>
        </div>
        <button onClick={() => (SubmitNewCard())} disabled={check ? false : true}>Criar Cartões</button>
      </div>  
      }
    </div>
  )
}

export default Cards