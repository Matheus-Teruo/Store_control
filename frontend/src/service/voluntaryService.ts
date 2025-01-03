import api from "@/axios/axios";
import Voluntary, { SummaryVoluntary } from "@/data/volunteers/Voluntary";

export const getVoluntary = async (
  voluntaryUuid: string,
): Promise<Voluntary> => {
  const response = await api.get<Voluntary>(`volunteers/${voluntaryUuid}`);
  return response.data;
};

export const getVolunteers = async (): Promise<SummaryVoluntary[]> => {
  const response = await api.get<SummaryVoluntary[]>("/volunteers");
  return response.data;
};

export const updateVoluntary = async (): Promise<Voluntary> => {
  const response = await api.put<Voluntary>("/volunteers");
  return response.data;
};

export const updateVoluntaryFunction = async (): Promise<Voluntary> => {
  const response = await api.put<Voluntary>("/volunteers/function");
  return response.data;
};
