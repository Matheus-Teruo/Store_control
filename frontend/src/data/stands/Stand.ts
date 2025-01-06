import Association from "./Association";

export default interface Stand {
  uuid: string;
  standName: string;
  association: Association;
}

export interface SummaryStand {
  uuid: string;
  standName: string;
  associationUuid: string;
}

export interface CreateStand {
  standName: string;
  associationUuid: string;
}

export interface UpdateStand {
  uuid: string;
  standName: string;
  associationUuid: string;
}
