import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import ResponseStandChart, {
  ResponseStandProductTotal,
  ResponseStandTotal,
} from "@data/statistics/standChart";
import { useCallback } from "react";

const useStatisticsStandService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const getStandTotals = useCallback(
    async (
      startTime: string,
      endTime: string,
      standUuid?: string,
    ): Promise<ResponseStandTotal[]> =>
      safeRequest(() =>
        api
          .get<ResponseStandTotal[]>("statistics/stands", {
            params: {
              standUuid: standUuid != "" ? standUuid : undefined,
              startTime,
              endTime,
            },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getProductTotals = useCallback(
    async (
      startTime: string,
      endTime: string,
      standUuid?: string,
    ): Promise<ResponseStandProductTotal[]> =>
      safeRequest(() =>
        api
          .get<ResponseStandProductTotal[]>("statistics/stands/products", {
            params: {
              standUuid: standUuid != "" ? standUuid : undefined,
              startTime,
              endTime,
            },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getPurchaseCharts = useCallback(
    async (
      startTime: string,
      endTime: string,
      standUuid?: string,
    ): Promise<ResponseStandChart[]> =>
      safeRequest(() =>
        api
          .get<ResponseStandChart[]>("statistics/stands/purchases", {
            params: {
              standUuid: standUuid != "" ? standUuid : undefined,
              startTime,
              endTime,
            },
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
