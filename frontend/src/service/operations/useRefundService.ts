import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import Refund, { SummaryRefund } from "@data/operations/Refund";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useRefundService = () => {
  const api = useAxios();
  const handleApiError = useApiError();

  const safeRequest = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      try {
        return await fn();
      } catch (error) {
        handleApiError(error);
        return null;
      }
    },
    [handleApiError],
  );

  const getRefund = useCallback(
    async (refundUuid: string): Promise<Refund | null> =>
      safeRequest(() =>
        api.get<Refund>(`refunds/${refundUuid}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getRefunds = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryRefund> | null> =>
      safeRequest(() =>
        api
          .get<
            PaginatedResponse<SummaryRefund>
          >("refunds", { params: { page, size, sort } })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  return { getRefund, getRefunds };
};

export default useRefundService;
