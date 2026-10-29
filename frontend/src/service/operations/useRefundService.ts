import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import Refund, { SummaryRefund } from "@data/operations/Refund";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useRefundService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const getRefund = useCallback(
    async (refundUuid: string): Promise<Refund> =>
      safeRequest(() =>
        api.get<Refund>(`refunds/${refundUuid}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getRefunds = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: string,
    ): Promise<PaginatedResponse<SummaryRefund>> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<SummaryRefund>>("refunds", {
          params: { page, size, sort },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  return {
    getRefund,
    getRefunds,
  };
};

export default useRefundService;
