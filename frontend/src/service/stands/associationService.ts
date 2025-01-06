import api from "@/axios/axios";
import Association, {
  CreateAssociation,
  SummaryAssociation,
  UpdateAssociation,
} from "@data/stands/Association";

export const createAssociation = async (
  association: CreateAssociation,
): Promise<Association> => {
  const response = await api.post<Association>("associations", association);
  return response.data;
};

export const getAssociation = async (
  associationUuid: string,
): Promise<Association> => {
  const response = await api.get<Association>(
    `associations/${associationUuid}`,
  );
  return response.data;
};

export const getAssociations = async (): Promise<SummaryAssociation[]> => {
  const response = await api.get<SummaryAssociation[]>("associations");
  return response.data;
};

export const updateAssociation = async (
  association: UpdateAssociation,
): Promise<Association> => {
  const response = await api.put<Association>("associations", association);
  return response.data;
};

export const deleteAssociation = async (
  associationUuid: string,
): Promise<void> => {
  await api.delete<void>(`associations/${associationUuid}`);
};
