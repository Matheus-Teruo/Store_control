import api from "@/axios/axios";
import CashRegister, {
  CreateCashRegister,
  SummaryCashRegister,
  UpdateCashRegister,
} from "@data/registers/CashRegister";

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

export const getRegisters = async (): Promise<SummaryCashRegister[]> => {
  const response = await api.get<SummaryCashRegister[]>("registers");
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
