import api from "@/axios/axios";
import CashRegister, {
  CreateCashRegister,
  SummaryCashRegister,
  UpdateCashRegister,
} from "@data/registers/CashRegister";
import { PaginatedResponse } from "@service/PagesType";

export const createRegister = async (
  register: CreateCashRegister,
): Promise<CashRegister> => {
  const response = await api.post<CashRegister>("registers", register);
  return response.data;
};

export const getRegister = async (
  registerUuid: string,
): Promise<CashRegister> => {
  const response = await api.get<CashRegister>(`registers/${registerUuid}`);
  return response.data;
};

export const getRegisters = async (
  page?: number,
  size?: number,
  sort?: "asc" | "desc",
): Promise<PaginatedResponse<SummaryCashRegister>> => {
  const response = await api.get<PaginatedResponse<SummaryCashRegister>>(
    "registers",
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

export const getListRegisters = async (): Promise<SummaryCashRegister[]> => {
  const response = await api.get<SummaryCashRegister[]>("registers/list");
  return response.data;
};

export const updateRegister = async (
  register: UpdateCashRegister,
): Promise<CashRegister> => {
  const response = await api.put<CashRegister>("registers", register);
  return response.data;
};

export const deleteRegister = async (registerUuid: string): Promise<void> => {
  await api.delete<void>(`registers/${registerUuid}`);
};
