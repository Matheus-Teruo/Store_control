import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import SummaryFunction from "@data/volunteers/Function";
import { useCallback } from "react";

const useFunctionService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const getListFunctions = useCallback(
    async (): Promise<SummaryFunction[]> =>
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
