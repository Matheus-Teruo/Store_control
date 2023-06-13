import React, { useState, useEffect } from 'react';
import { Form, redirect  } from 'react-router-dom';
import bcrypt from 'bcryptjs';

const regexnumber = /[0-9]/
const regexletter = /[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]/
const regexspace = /\s/
const regexspecial = /["]|[']|[\\]|[/]|[.]/

function Signup() {
  const [username, setUsername] = useState("")
  const [fullname, setFullname] = useState("")
  const [password, setPassword] = useState("")
  const [submitvalid, setSubmitvalid] = useState(false);
  const [usernameValidation, setUsernameValidation] = useState({haveMinChar: false, noSpace: true, noSpecialChar: true, noUsed: true})
  const [fullnameValidation, setFullnameValidation] = useState({haveMinChar: false, noSpecialChar: true, noUsed: true})
  const [passwordValidation, setPasswordValidation] = useState({haveMinChar: false, noSpace: true, haveLetter: false, haveNumber: false})

  useEffect(() => {
    if (usernameValidation.haveMinChar &&
        usernameValidation.noSpace &&
        usernameValidation.noSpecialChar &&
        usernameValidation.noUsed &&
        fullnameValidation.haveMinChar &&
        fullnameValidation.noSpecialChar &&
        fullnameValidation.noUsed &&
        passwordValidation.haveMinChar &&
        passwordValidation.noSpace &&
        passwordValidation.haveLetter &&
        passwordValidation.haveNumber){
          setSubmitvalid(true);
        } else {
          setSubmitvalid(false);
        }
  }, [usernameValidation, fullnameValidation, passwordValidation])

  async function SubmitSingUp(event) {
    event.preventDefault()
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    var resStatus = ""
    fetch("/api/signup", {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        "username": username,
        "fullname": fullname,
        "password": hash,
        "salt": salt
      })
    })
      .then(res => {
        resStatus = res.status
        return res.json()})
      .then(data => {
        if (resStatus=== 201){
          // Redirect
          return redirect('/');
        } else if (resStatus === 409) {
          // Duplicado
          if (data.column === "usuario") {
            setUsernameValidation((usernameValidation) => {
              return {...usernameValidation, noUsed: false};}
            )
          } else if (data.column === "nome") {
            setFullnameValidation((fullnameValidation) => {
              return {...fullnameValidation, noUsed: false}}
            )
          }
        }
      })
      .catch(console.error)
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
    setUsernameValidation((usernameValidation) => {
      return {...usernameValidation, noUsed: true};
    })

    // Verificando tamanho mínimo
    if (event.target.value.trim().length >= 4) {
      setUsernameValidation((usernameValidation) => {
        return {...usernameValidation, haveMinChar: true};
    })} else {
      setUsernameValidation((usernameValidation) => {
        return {...usernameValidation, haveMinChar: false};
    })};

    // Verificando tamanho mínimo se possui spaces
    if (!regexspace.test(event.target.value)) {
      setUsernameValidation((usernameValidation) => {
        return {...usernameValidation, noSpace: true};
    })} else {
      setUsernameValidation((usernameValidation) => {
        return {...usernameValidation, noSpace: false};
    })};

    // Verificando caracter especial
    if (!regexspecial.test(event.target.value)) {
      setUsernameValidation((usernameValidation) => {
        return {...usernameValidation, noSpecialChar: true};
    })} else {
      setUsernameValidation((usernameValidation) => {
        return {...usernameValidation, noSpecialChar: false};
    })};
  };

  const handleFullnameChange = (event) => {
    setFullname(event.target.value);
    setFullnameValidation((fullnameValidation) => {
      return {...fullnameValidation, noUsed: true}
    })

    // Verificando tamanho mínimo
    if (event.target.value.trim().length >= 6) {
      setFullnameValidation((fullnameValidation) => {
        return {...fullnameValidation, haveMinChar: true}
      })
    } else {
      setFullnameValidation((fullnameValidation) => {
        return {...fullnameValidation, haveMinChar: false}
      })
    }

    // Verificando caracter especial
    if (!regexspecial.test(event.target.value)) {
      setFullnameValidation((fullnameValidation) => {
        return {...fullnameValidation, noSpecialChar: true};
    })} else {
      setFullnameValidation((fullnameValidation) => {
        return {...fullnameValidation, noSpecialChar: false};
    })};
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    // Verificando tamanho mínimo
    if (event.target.value.trim().length >= 6) {
      setPasswordValidation((passwordValidation) => {
        return {...passwordValidation, haveMinChar: true};
    })} else {
      setPasswordValidation((passwordValidation) => {
        return {...passwordValidation, haveMinChar: false};
    })};

    // Verificando se possui letras
    if (regexletter.test(event.target.value)) {
      setPasswordValidation((passwordValidation) => {
        return {...passwordValidation, haveLetter: true};
    })} else {
      setPasswordValidation((passwordValidation) => {
        return {...passwordValidation, haveLetter: false};
    })};

    // Verificando se possui numero
    if (regexnumber.test(event.target.value)) {
      setPasswordValidation((passwordValidation) => {
        return {...passwordValidation, haveNumber: true};
    })} else {
      setPasswordValidation((passwordValidation) => {
        return {...passwordValidation, haveNumber: false};
    })};

    // Verificando tamanho mínimo se possui spaces
    if (!regexspace.test(event.target.value)) {
      setPasswordValidation((passwordValidation) => {
        return {...passwordValidation, noSpace: true};
    })} else {
      setPasswordValidation((passwordValidation) => {
        return {...passwordValidation, noSpace: false};
    })};
  };

  return (
    <div>
      <h1>Sign-up</h1>
      <Form method="post">
        <div>
          <label>Usuário:</label>
          <input 
            value={username} 
            onChange={handleUsernameChange} 
            id="username" 
            type="text" 
            name="username" 
          />
          {!usernameValidation.haveMinChar && <div>minChar</div>}
          {!usernameValidation.noSpace && <div>noSpace</div>}
          {!usernameValidation.noSpecialChar && <div>noCharEspecial</div>}
          {!usernameValidation.noUsed && <div>noUsed</div>}
        </div>
        <div>
          <label htmlFor="fullname">Nome Completo:</label>
          <input 
            value={fullname} 
            onChange={handleFullnameChange} 
            id="Fullname" 
            type="text" 
            name="Fullname" 
          />
          {!fullnameValidation.haveMinChar && <div>minChar</div>}
          {!fullnameValidation.noSpecialChar && <div>noCharEspecial</div>}
          {!fullnameValidation.noUsed && <div>noUsed</div>}
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input 
            value={password} 
            onChange={handlePasswordChange} 
            id="password" 
            type="password" 
            name="password" 
          />
          {!passwordValidation.haveMinChar && <div>minChar</div>}
          {!passwordValidation.haveLetter && <div>haveletter</div>}
          {!passwordValidation.haveNumber && <div>havenumber</div>}
          {!passwordValidation.noSpace && <div>noSpace</div>}
        </div>
        <button onClick={SubmitSingUp} type="submit" disabled={submitvalid ? false : true}>Sign up</button>
      </Form>
    </div>
  )
}

export default Signup