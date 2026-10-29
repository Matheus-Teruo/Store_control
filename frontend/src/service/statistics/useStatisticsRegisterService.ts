import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import ResponseRegisterChart, {
  ResponsePaymentTypeTotal,
} from "@data/statistics/registerChart";
import { useCallback } from "react";

const useStatisticsRegisterService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const getPaymentTypeTotals = useCallback(
    async (
      startTime: string,
      endTime: string,
    ): Promise<ResponsePaymentTypeTotal[]> =>
      safeRequest(() =>
        api
          .get<ResponsePaymentTypeTotal[]>("statistics/registers/payment-type", {
            params: {
              startTime,
              endTime,
            },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getRechargeCharts = useCallback(
    async (
      startTime: string,
      endTime: string,
    ): Promise<ResponseRegisterChart[]> =>
      safeRequest(() =>
        api
          .get<ResponseRegisterChart[]>("statistics/registers/recharges", {
            params: {
              startTime,
              endTime,
            },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  return {
    getPaymentTypeTotals,
    getRechargeCharts,
  };
};

export default useStatisticsRegisterService;
