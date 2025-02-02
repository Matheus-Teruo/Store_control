import { useHandleApiError } from "@/axios/handlerApiError";
import useAxios from "@/axios/useAxios";
import Recharge, {
  CreateRecharge,
  SummaryRecharge,
} from "@data/operations/Recharge";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useRechargeService = () => {
  const api = useAxios();
  const handleApiError = useHandleApiError();

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

  const createRecharge = useCallback(
    async (recharge: CreateRecharge): Promise<Recharge | null> =>
      safeRequest(() =>
        api.post<Recharge>("recharges", recharge).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getRecharge = useCallback(
    async (rechargeUuid: string): Promise<Recharge | null> =>
      safeRequest(() =>
        api.get<Recharge>(`recharges/${rechargeUuid}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getRecharges = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryRecharge> | null> =>
      safeRequest(() =>
        api
          .get<
            PaginatedResponse<SummaryRecharge>
          >("recharges", { params: { page, size, sort } })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getLast3Recharges = useCallback(
    async (): Promise<SummaryRecharge[] | null> =>
      safeRequest(() =>
        api.get<SummaryRecharge[]>("recharges/last3").then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deleteRecharge = useCallback(
    async (rechargeUuid: string): Promise<void> => {
      await safeRequest(() => api.delete<void>(`recharges/${rechargeUuid}`));
    },
    [api, safeRequest],
  );

  return {
    createRecharge,
    getRecharge,
    getRecharges,
    getLast3Recharges,
    deleteRecharge,
  };
};

export default useRechargeService;
