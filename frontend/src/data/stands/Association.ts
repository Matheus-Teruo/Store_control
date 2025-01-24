export default interface Association {
  uuid: string;
  associationName: string;
  principalName: string;
}

export interface SummaryAssociation {
  uuid: string;
  associationName: string;
}

export interface CreateAssociation {
  associationName: string;
  principalName: string;
}

export interface UpdateAssociation {
  uuid: string;
  associationName?: string;
  principalName?: string;
}
