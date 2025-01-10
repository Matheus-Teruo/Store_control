import api from "@/axios/axios";
import Refund, { SummaryRefund } from "@data/operations/Refund";
import { PaginatedResponse } from "@service/PagesType";

export const getRefund = async (refundUuid: string): Promise<Refund> => {
  const response = await api.get<Refund>(`refunds/${refundUuid}`);
  return response.data;
};

export const getRefunds = async (
  page?: number,
  size?: number,
  sort?: "asc" | "desc",
): Promise<PaginatedResponse<SummaryRefund>> => {
  const response = await api.get<PaginatedResponse<SummaryRefund>>("refunds", {
    params: {
      page: page,
      size: size,
      sort: sort,
    },
  });
  return response.data;
};
