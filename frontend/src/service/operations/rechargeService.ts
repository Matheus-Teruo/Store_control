import api from "@/axios/axios";
import Recharge, {
  CreateRecharge,
  SummaryRecharge,
} from "@data/operations/Recharge";

export const createRecharge = async (
  recharge: CreateRecharge,
): Promise<Recharge> => {
  const response = await api.post<Recharge>("recharges", recharge);
  return response.data;
};

export const getRecharge = async (rechargeUuid: string): Promise<Recharge> => {
  const response = await api.get<Recharge>(`recharges/${rechargeUuid}`);
  return response.data;
};

export const getRecharges = async (
  page?: number,
  size?: number,
  sort?: "asc" | "desc",
): Promise<SummaryRecharge[]> => {
  const response = await api.get<SummaryRecharge[]>("recharges", {
    params: {
      page: page,
      size: size,
      sort: sort,
    },
  });
  return response.data;
};

export const getLast3Recharges = async (): Promise<SummaryRecharge[]> => {
  const response = await api.get<SummaryRecharge[]>("recharges/last3");
  return response.data;
};

export const deleteRecharge = async (rechargeUuid: string): Promise<void> => {
  await api.delete<void>(`recharges/${rechargeUuid}`);
};
