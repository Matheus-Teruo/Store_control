import SummaryFunction from "./Function";

export default interface Voluntary {
  uuid: string;
  username: string;
  fullname: string;
  summaryFunction?: SummaryFunction;
  voluntaryRole: VoluntaryRole;
}

export interface SummaryVoluntary {
  uuid: string;
  fullname: string;
  summaryFunction?: SummaryFunction;
  voluntaryRole: VoluntaryRole;
}

export interface UpdateVoluntary {
  uuid: string;
  username?: string;
  password?: string;
  fullname?: string;
}

export interface UpdateVoluntaryFunction {
  uuid: string;
  functionUuid: string;
}

export interface UpdateVoluntaryRole {
  uuid: string;
  voluntaryRole: VoluntaryRole;
}

export enum VoluntaryRole {
  VOLUNTARY = "voluntary",
  MANAGEMENT = "management",
  ADMIN = "admin",
}
