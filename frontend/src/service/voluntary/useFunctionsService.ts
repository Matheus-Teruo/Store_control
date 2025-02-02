import { useHandleApiError } from "@/axios/handlerApiError";
import useAxios from "@/axios/useAxios";
import SummaryFunction from "@data/volunteers/Function";
import { useCallback } from "react";

const useFunctionService = () => {
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

  const getListFunctions = useCallback(
    async (): Promise<SummaryFunction[] | null> =>
      safeRequest(() =>
        api.get<SummaryFunction[]>("functions").then((res) => res.data),
      ),
    [api, safeRequest],
  );

  return {
    getListFunctions,
  };
};

export default useFunctionService;
