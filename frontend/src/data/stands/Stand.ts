import Association from "./Associaiton";

export default interface Stand{
  uuid: string;
  standName: string;
  association: Association;
}

export interface SummaryStand{
  uuid: string;
  standName: string;
}