export default interface Association {
  uuid: string;
  associaitonName: string;
  principalName: string;
}

export interface SummaryAssociation {
  uuid: string;
  associaitonName: string;
}

export interface CreateAssociation {
  associaitonName: string;
  principalName: string;
}

export interface UpdateAssociation {
  uuid: string;
  associaitonName: string;
  principalName: string;
}
