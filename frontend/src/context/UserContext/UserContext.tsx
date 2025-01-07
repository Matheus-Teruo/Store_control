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
    const logginUser = await getUser();
    if (logginUser !== null) {
      setUser(logginUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(logginUser));
    }
  };

  const logout = async () => {
    if (user) {
      await LogoutVoluntary();
      setUser("unlogged");
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  function doesCookieExist(cookieName: string) {
    const cookies = document.cookie
      .split("; ")
      .map((cookie) => cookie.split("=")[0]);
    return cookies.includes(cookieName);
  }

  useEffect(() => {
    if (!user && user !== "unlogged") {
      if (doesCookieExist("auth")) {
        const storedUser = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          checkLogged();
        }
      } else {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setUser("unlogged");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider
      value={{ user, isLoggedIn: !!user, login, checkLogged, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}
