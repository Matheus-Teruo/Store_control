import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { Maximize } from 'react-feather';
import AuthContext from '../../store/auth_context';
import Scanner from '../main/inputs/Scanner';
import Code from './inputs/Code';
import Quagga from 'quagga';

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

  function handleChange(event) {  // Card conditions
    if (event.target.id === "card"){  // Code
      setNewCardID(event.target.value);
    }
  };

  const handleScan = (value) => {  // Take result of scanner
    setNewCardID(value)
    Quagga.stop()
    setShowScanner(false)
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
        <button onClick={() => setShowScanner(true)}><Maximize/></button>
          <Code
          output={handleChange}
          card={newCardID}
          dupliValue={alreadyUsed}
          valid={(value) => setCheck(value)}/>
        </div>
        <button onClick={() => (SubmitNewCard())} disabled={check ? false : true}>Criar Cartões</button>
      </div>  
      }

      {showScanner &&
      <div className="BlackBackgroundScanner" onClick={() => {setShowScanner(false); return Quagga.stop()}}>
        <Scanner DetectedCode={handleScan} output={handleScan}/>
      </div>
      }
    </div>
  )
}

export default Cards