export default interface Tag {
  uuid: string;
  tagName: string;
  color: string;
}

export interface CreateTag {
  tagName: string;
  color: string;
}

export interface UpdateTag {
  uuid: string;
  tagName?: string;
  color?: string;
}
