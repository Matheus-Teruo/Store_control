import User from "@data/volunteers/User";
import React, { useCallback, useEffect, useState } from "react";
import { UserContext } from "./useUserContext";
import useUserService from "@service/voluntary/useUserService";
import { isApiError } from "@/utils/checkApiResponse";

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
      const loginUser = await getUser();
      setUser(loginUser);
    } catch (error) {
      if (isApiError(error)) {
        setUser("unlogged")
        return
      }
      setUser("unlogged");
      console.log(error);
    }
  }, [getUser]);

  const logout = async () => {
    if (user) {
      setUser("unlogged");
      await logoutVoluntary();
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
