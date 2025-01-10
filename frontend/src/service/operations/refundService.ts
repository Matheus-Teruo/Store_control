import api from "@/axios/axios";
import Refund, { SummaryRefund } from "@data/operations/Refund";

export const getRefund = async (refundUuid: string): Promise<Refund> => {
  const response = await api.get<Refund>(`refunds/${refundUuid}`);
  return response.data;
};

export const getRefunds = async (
  page?: number,
  size?: number,
  sort?: "asc" | "desc",
): Promise<SummaryRefund[]> => {
  const response = await api.get<SummaryRefund[]>("refunds", {
    params: {
      page: page,
      size: size,
      sort: sort,
    },
  });
  return response.data;
};
