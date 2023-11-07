import './Cards.css'
import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { Plus, Play, Pause } from 'react-feather';
import AuthContext from '../../store/auth_context';
import QRcodeScanner from '../main/inputs/QRcodeScanner';
import Code from './inputs/Code';
import Barcode from '../../midia/Barcode';

function Cards() {
  const [cards, setCards] = useState([])
  const [showCard, setShowCard] = useState(false)
  const [newCardID, setNewCardID] = useState("")
  const [showScanner, setShowScanner] = useState(false)
  const [check, setCheck] = useState(false)
  const [filter, setFilter] = useState(0)
  const [alreadyUsed, setAlreadyUsed] = useState("");
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {  // Page requirements
    if (auth.user.authenticated === true && auth.user.superuser) {
      RequestCards()
    } else if (auth.user.authenticated === false) {
      navigate('/login');
    } else if (auth.user.authenticated === true && !auth.user.superuser){
      navigate('/')
    }
  }, [auth, navigate])

  async function RequestCards() {  // List all Cards
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

  async function SubmitNewCard() {  // Submit new card
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
            RequestCards()
            setNewCardID("")
            setShowCard(false); setCheck(false); setAlreadyUsed("")
          } else if (resStatus === 409) {
            setAlreadyUsed(data.value);
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
        .catch(console.error)
    }
  }

  function handleChange(event) {  // Card conditions
    if (event.target.id === "card"){  // Code
      setNewCardID(event.target.value);
    }
  };

  const handleScan = (value) => {  // Take result of scanner
    setNewCardID(value)
    setShowScanner(false)
  };

  return (
    <div className="Cards">
      <div className="Menu">
        <h2>Cartões</h2>
      </div>
      <div className="Actions">
        <button onClick={() => {setShowCard(true)}}><Plus/><p>Cartão</p></button>
        <div className="Filter">
          <h3>Filtro</h3>
          <select value={filter} onChange={event => setFilter(event.target.value)} id="filter" name="filter">
            <option value={0}>Todos</option>
            <option value={1}>Cartões vazios</option>
            <option value={2}>Com crédito</option>
          </select>
        </div>
      </div>
      <div className="Main">
        <ul>
          <li id="header"><p id="cardcode">Código do Cartão</p><p id="debit">Débito</p><p id="in_use">Em uso</p></li>
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
              <p id="cardcode">{card.cardID}</p>
              <p id="debit">{card.debit}</p>  
              <p id="in_use">{card.in_use === 1? <Play size={20}/> : <Pause size={20}/> }</p>
            </li>  
          ))}
        </ul>
      </div>

      {showCard &&
      <>
      <div className="BlackBackground" onClick={() => setShowCard(false)}/>
      <div className={`Newcard ${check? "valid" : "" }`}>
        <div className="Codebar">
        <button onClick={() => setShowScanner(true)}><Barcode/></button>
          <Code
          output={handleChange}
          card={newCardID}
          dupliValue={alreadyUsed}
          valid={(value) => setCheck(value)}/>
        </div>
        {alreadyUsed === newCardID && (newCardID.toString().length === 12) && <><p>Cartão</p><span>{newCardID}</span><p>já registrado</p></>}
        <button id="createcard" onClick={() => (SubmitNewCard())} disabled={check ? false : true}>Criar</button>
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

export default Cards