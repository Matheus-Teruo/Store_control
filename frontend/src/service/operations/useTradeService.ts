import { useHandleApiError } from "@/axios/handlerApiError";
import useAxios from "@/axios/useAxios";
import Customer from "@data/customers/Customer";
import Trade, { CreateTrade } from "@data/operations/Trade";
import { useCallback } from "react";

const useTradeService = () => {
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

  const createTrade = useCallback(
    async (trade: CreateTrade): Promise<Trade | null> =>
      safeRequest(() =>
        api.post<Trade>("trades", trade).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deleteTrade = useCallback(
    async (cardId: string): Promise<Customer | null> =>
      safeRequest(() =>
        api.delete<Customer>(`trades/${cardId}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  return { createTrade, deleteTrade };
};

export default useTradeService;
