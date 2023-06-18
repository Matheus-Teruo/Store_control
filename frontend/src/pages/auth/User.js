import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/auth_context';

function User() {
  const [user, setUser] = useState(
    {username: "",
     fullname: "",
     kenjinkai: "",
     obervação: ""})
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (auth.user.authenticated === true) {
      var resStatus;
      fetch('/api/user')
        .then(res => {
          resStatus = res.status;
          return res.json()})
        .then(data => {
          if (resStatus === 200){
            return setUser(data)
          } else if (resStatus === 401){
            return auth.onLogout()
          }
        })
    } else {
      navigate('/login');
    }
  }, [auth, navigate])

  return (
    <div>
      {auth.user.authenticated ?
      <div>
        <div>
          <p>Uduário</p>
          <p>{user.username}</p>
        </div>
        <div>
          <p>Nome Completo</p>
          <p>{user.fullname}</p>
        </div>
        <div>
          <p>Estande</p>
          <p>{user.kenjinkai}</p>
          <p>{user.obervação}</p>
        </div>
        <div>
          <buttom>
            Editar Perfil
          </buttom>
          <buttom>
            Log out
          </buttom>
        </div>  
      </div>
      :
      <div>
        <p> Usuário deslogado </p>
      </div>
      }
    </div>
  )
}

export default User