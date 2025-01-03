import SummaryFunction from "./Function";

export default interface Voluntary{
  uuid: string;
  username: string;
  fullname: string;
  summaryFunction: SummaryFunction;
  voluntaryRole: VoluntaryRole;
}

export interface SummaryVoluntary{
  uuid: string;
  fullname: string;
  summaryFunction: SummaryFunction;
  voluntaryRole: VoluntaryRole;
}

export interface UpdateVoluntary{
  uuid: string;
  username: string;
  password: string;
  fullname: string;
}

export interface UpdateVoluntaryFunction{
  uuid: string;
  functionUuid: string;
}

export interface UpdateRoleVoluntary{
  uuid: string;
  voluntaryRole: VoluntaryRole;
}

export enum VoluntaryRole{
  ROLE_USER = "voluntary",
  ROLE_MANAGEMENT = "management",
  ROLE_ADMIN = "admin"
}