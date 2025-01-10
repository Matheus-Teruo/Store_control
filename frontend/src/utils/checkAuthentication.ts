import SummaryFunction from "@data/volunteers/Function";
import User from "@data/volunteers/User";
import { VoluntaryRole } from "@data/volunteers/Voluntary";

export function isUserLogged(user: User | null | "unlogged"): user is User {
  return user !== null && user !== "unlogged";
}

export function isUserUnlogged(
  user: User | null | "unlogged",
): user is "unlogged" {
  return user !== null && user === "unlogged";
}

export function hasFunction(
  userFunction: SummaryFunction | null | undefined,
): userFunction is SummaryFunction {
  return userFunction !== null && userFunction !== undefined;
}

export function isSeller(
  userFunction: SummaryFunction | null | undefined,
): userFunction is SummaryFunction {
  return (
    userFunction !== null &&
    userFunction !== undefined &&
    userFunction.typeOfFunction === "Stand"
  );
}

export function isCashier(
  userFunction: SummaryFunction | null | undefined,
): userFunction is SummaryFunction {
  return (
    userFunction !== null &&
    userFunction !== undefined &&
    userFunction.typeOfFunction === "Register"
  );
}

export function isManegement(user: User | null | "unlogged"): user is User {
  return isUserLogged(user) && user.voluntaryRole !== VoluntaryRole.ROLE_USER;
}

export function isAdmin(user: User | null | "unlogged"): user is User {
  return isUserLogged(user) && user.voluntaryRole === VoluntaryRole.ROLE_ADMIN;
}
