import React, { useState } from 'react';

const AuthContext = React.createContext({
  user: {authenticated: false, firstname: ""},
  onLogin: () => {},
  onLogout: () => {},
});

export const AuthContextProvider = (props) => {
  const [user, setUser] = useState({authenticated: 2, firstname: "", superuser: false});

  async function loginHandler() {
    fetch("/api/checkuser")
      .then(res => res.json())
      .then(data => {
        if (data.authenticated === true) {
          return setUser({authenticated: true, firstname: data.firstname, superuser: data.superuser});
        } else {
          return setUser({authenticated: false, firstname: "", superuser: false});
        }
      })
  }

  async function logoutHandler() {
    fetch("/api/logout", {
      method: "POST"})
      .then(() => {
        return setUser({authenticated: false, firstname: "", superuser: false});
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