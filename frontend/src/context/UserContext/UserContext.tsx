import User from "@data/volunteers/User";
import React, { useState } from "react";
import { UserContext } from "./useUserContext";
import { getUser, LogoutVoluntary } from "@service/userService";

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const checkLogged = async () => {
    const logginUser = await getUser();
    if (logginUser !== null) {
      setUser({
        uuid: logginUser.uuid,
        firstName: logginUser.firstName,
        summaryFunction: logginUser.summaryFunction,
        voluntaryRole: logginUser.voluntaryRole,
      });
    }
  };

  const logout = async () => {
    if (user) {
      await LogoutVoluntary();
    }
  };

  return (
    <UserContext.Provider
      value={{ user, isLoggedIn: !!user, checkLogged, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}
