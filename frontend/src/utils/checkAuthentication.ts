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
  admin?: VoluntaryRole,
): userFunction is SummaryFunction {
  return (
    (userFunction !== null && userFunction !== undefined) ||
    admin === VoluntaryRole.ADMIN
  );
}

export function isSeller(
  userFunction: SummaryFunction | null | undefined,
  admin?: VoluntaryRole,
): userFunction is SummaryFunction {
  return (
    (userFunction && userFunction.typeOfFunction === "Stand") ||
    admin === VoluntaryRole.ADMIN
  );
}

export function isCashier(
  userFunction: SummaryFunction | null | undefined,
  admin?: VoluntaryRole,
): userFunction is SummaryFunction {
  return (
    (userFunction && userFunction.typeOfFunction === "Register") ||
    admin === VoluntaryRole.ADMIN
  );
}

export function isManegement(user: User | null | "unlogged"): user is User {
  return isUserLogged(user) && user.voluntaryRole !== VoluntaryRole.VOLUNTARY;
}

export function isAdmin(user: User | null | "unlogged"): user is User {
  return isUserLogged(user) && user.voluntaryRole === VoluntaryRole.ADMIN;
}
