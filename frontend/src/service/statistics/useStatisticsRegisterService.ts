import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import ResponseRegisterChart, {
  ResponsePaymentTypeTotal,
} from "@data/statistics/registerChart";
import { useCallback } from "react";

const useStatisticsRegisterService = () => {
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
  const getPaymentTypeTotals = useCallback(
    async (): Promise<ResponsePaymentTypeTotal[] | null> =>
      safeRequest(() =>
        api
          .get<ResponsePaymentTypeTotal[]>(`statistics/register/payment-type`)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getRechargeCharts = useCallback(
    async (): Promise<ResponseRegisterChart[] | null> =>
      safeRequest(() =>
        api
          .get<ResponseRegisterChart[]>(`statistics/register/recharges`)
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
