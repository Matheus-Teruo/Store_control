import SummaryFunction from "./Function";
import { VoluntaryRole } from "./Voluntary";

export default interface User {
  uuid: string;
  firstName: string;
  summaryFunction?: SummaryFunction | null;
  voluntaryRole: VoluntaryRole;
}

export interface SignupVoluntary {
  username: string;
  password: string;
  fullname: string;
  associationKey: string;
}

export interface LoginVoluntary {
  username: string;
  password: string;
}
