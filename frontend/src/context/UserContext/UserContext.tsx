import User from "@data/volunteers/User";
import React, { useEffect, useState } from "react";
import { UserContext } from "./useUserContext";
import { getUser, LogoutVoluntary } from "@service/voluntary/userService";

const LOCAL_STORAGE_KEY = "loggedInUser";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null | "unlogged">(null);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
  };

  const checkLogged = async () => {
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
  };

  const logout = async () => {
    if (user) {
      await LogoutVoluntary();
      setUser("unlogged");
    }
  };

  useEffect(() => {
    checkLogged();
  }, []);

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
