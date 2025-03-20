export default interface Association {
  uuid: string;
  associationName: string;
  principalName: string;
  associationKey: string;
}

export interface SummaryAssociation {
  uuid: string;
  associationName: string;
  associationKey: string;
}

export interface CreateAssociation {
  associationName: string;
  principalName: string;
  associationKey: string;
}

export interface UpdateAssociation {
  uuid: string;
  associationName?: string;
  principalName?: string;
  associationKey?: string;
}
