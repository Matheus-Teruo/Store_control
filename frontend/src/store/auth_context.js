import React, { useState } from 'react';

const AuthContext = React.createContext({
  user: {authenticated: false, firstname: "", secret: false},
  onLogin: () => {},
  onLogout: () => {},
});

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState({authenticated: false, firstname: "", secret: false});

  async function loginHandler() {
    fetch("/api/checkuser")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated === true) {
          return setUser({authenticated: true, firstname: data.firstname, secret: data.superuser});
        } else {
          return setUser({authenticated: false, firstname: "", secret: false});
        }
      })
  }

  async function logoutHandler() {
    fetch("/api/logout", {
      method: "POST"})
      .then(setUser({authenticated: false, firstname: "", secret: false}))
      .catch(console.error)
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