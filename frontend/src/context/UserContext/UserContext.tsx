import User from "@data/volunteers/User";
import React, { useState } from "react";
import { UserContext } from "./useUserContext";

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = () => {};

  const logout = () => {};

  return (
    <UserContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}
