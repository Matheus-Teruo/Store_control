import React, { useState } from 'react';

const AuthContext = React.createContext({
  user: {authenticated: false, firstname: ""},
  onLogin: () => {},
  onLogout: () => {},
});

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState({authenticated: false, firstname: ""});

  async function loginHandler() {
    fetch("/api/checkuser")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated === true) {
          return setUser({authenticated: true, firstname: data.firstname});
        } else {
          return setUser({authenticated: false, firstname: ""});
        }
      })
  }

  async function logoutHandler() {
    fetch("/api/logout", {
      method: "POST"})
      .then(() => {
        return setUser({authenticated: false, firstname: ""});
      })
      .catch(() => {
        return console.error
      })
  }

  return (
    <AuthContext.Provider
      value={{
        user: user,
        onLogin: loginHandler,
        onLogout: logoutHandler,
      }}>
        {props.children}
      </AuthContext.Provider>
  )
}

export default AuthContext;