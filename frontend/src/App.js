import React, { useEffect, useState } from "react";
//import { Menu } from "react-feather";
import ShizuokaLogo from "./midia/Shizuoka.png";
import "./App.css";

function App() {
  const [Itens, setItens] = useState([]);
  // useEffect(() => {
  //   fetch("/api/")
  //     .then(res => res.json())
  //     .then(res => setMessage(res.message))
  //     .catch(console.error);
  // }, [setMessage]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={ShizuokaLogo} className="App-logo"/>
        <a>Login</a>
      </header>
      <div className="App-body">
        <div className="App-menu">
          Itens{}
        </div>
        {}
        <div className="App-itens">
          Comida
        </div>
      </div>
    </div>
  );
}

export default App;
