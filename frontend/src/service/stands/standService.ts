import api from "@/axios/axios";
import Stand, {
  CreateStand,
  SummaryStand,
  UpdateStand,
} from "@data/stands/Stand";

export const createStand = async (stand: CreateStand): Promise<Stand> => {
  const response = await api.post<Stand>("stands", stand);
  return response.data;
};

export const getStand = async (standUuid: string): Promise<Stand> => {
  const response = await api.get<Stand>(`stands/${standUuid}`);
  return response.data;
};

export const getStands = async (): Promise<SummaryStand[]> => {
  const response = await api.get<SummaryStand[]>("stands");
  return response.data;
};

export const updateStand = async (stand: UpdateStand): Promise<Stand> => {
  const response = await api.put<Stand>("stands", stand);
  return response.data;
};

export const deleteStand = async (standUuid: string): Promise<void> => {
  await api.delete<void>(`stands/${standUuid}`);
};
