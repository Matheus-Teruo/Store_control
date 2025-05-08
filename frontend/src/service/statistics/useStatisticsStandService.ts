import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import ResponseStandChart, {
  ResponseStandProductTotal,
  ResponseStandTotal,
} from "@data/statistics/standChart";
import { useCallback } from "react";

const useStatisticsStandService = () => {
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

  const getStandTotals = useCallback(
    async (standUuid: string): Promise<ResponseStandTotal[] | null> =>
      safeRequest(() =>
        api
          .get<ResponseStandTotal[]>(`statistics/stands`, {
            params: { standUuid: standUuid != "" ? standUuid : undefined },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getProductTotals = useCallback(
    async (standUuid: string): Promise<ResponseStandProductTotal[] | null> =>
      safeRequest(() =>
        api
          .get<ResponseStandProductTotal[]>(`statistics/stands/products`, {
            params: { standUuid: standUuid != "" ? standUuid : undefined },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getPurchaseCharts = useCallback(
    async (standUuid: string): Promise<ResponseStandChart[] | null> =>
      safeRequest(() =>
        api
          .get<ResponseStandChart[]>(`statistics/stands/purchases`, {
            params: { standUuid: standUuid != "" ? standUuid : undefined },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  return {
    getStandTotals,
    getProductTotals,
    getPurchaseCharts,
  };
};

export default useStatisticsStandService;
