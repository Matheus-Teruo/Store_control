import api from "@/axios/axios";
import SummaryFunction from "@data/volunteers/Function";

export const getListFunctions = async (): Promise<SummaryFunction[]> => {
  const response = await api.get<SummaryFunction[]>("functions");
  return response.data;
};
