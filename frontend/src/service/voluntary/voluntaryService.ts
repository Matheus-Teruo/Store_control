import api from "@/axios/axios";
import Voluntary, {
  SummaryVoluntary,
  UpdateVoluntary,
  UpdateVoluntaryFunction,
  UpdateVoluntaryRole,
} from "@/data/volunteers/Voluntary";
import { PaginatedResponse } from "@service/PagesType";

export const getVoluntary = async (
  voluntaryUuid: string,
): Promise<Voluntary> => {
  const response = await api.get<Voluntary>(`volunteers/${voluntaryUuid}`);
  return response.data;
};

export const getVolunteers = async (
  page?: number,
  size?: number,
  sort?: "asc" | "desc",
): Promise<PaginatedResponse<SummaryVoluntary>> => {
  const response = await api.get<PaginatedResponse<SummaryVoluntary>>(
    "/volunteers",
    {
      params: {
        page: page,
        size: size,
        sort: sort,
      },
    },
  );
  return response.data;
};

export const updateVoluntary = async (
  voluntary: UpdateVoluntary,
): Promise<Voluntary> => {
  const response = await api.put<Voluntary>("/volunteers", voluntary);
  return response.data;
};

export const updateVoluntaryFunction = async (
  voluntary: UpdateVoluntaryFunction,
): Promise<Voluntary> => {
  const response = await api.put<Voluntary>("/volunteers/function", voluntary);
  return response.data;
};

export const updateVoluntaryRole = async (
  voluntary: UpdateVoluntaryRole,
): Promise<Voluntary> => {
  const response = await api.put<Voluntary>("/volunteers/role", voluntary);
  return response.data;
};
