import User from "@data/volunteers/User";
import React, { useCallback, useEffect, useState } from "react";
import { UserContext } from "./useUserContext";
import useUserService from "@service/voluntary/useUserService";

const LOCAL_STORAGE_KEY = "loggedInUser";

function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | "unlogged">(null);
  const { getUser, logoutVoluntary } = useUserService();

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
  };

  const checkLogged = useCallback(async () => {
    try {
      const logginUser = await getUser();
      if (logginUser !== null) {
        setUser(logginUser);
      } else {
        setUser("unlogged");
      }
    } catch (error) {
      setUser("unlogged");
      console.log(error);
      // TODO: verificar o que fazer com as response do axios
    }
  }, [getUser]);

  const logout = async () => {
    if (user) {
      await logoutVoluntary();
      setUser("unlogged");
    }
  };

  useEffect(() => {
    checkLogged();
  }, [checkLogged]);

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        checkLogged,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserProvider;
