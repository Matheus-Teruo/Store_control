import api from "@/axios/axios";
import Refund, { SummaryRefund } from "@data/operations/Refund";

export const getRefund = async (refundUuid: string): Promise<Refund> => {
  const response = await api.get<Refund>(`refunds/${refundUuid}`);
  return response.data;
};

export const getRefunds = async (): Promise<SummaryRefund[]> => {
  const response = await api.get<SummaryRefund[]>("refunds");
  return response.data;
};
