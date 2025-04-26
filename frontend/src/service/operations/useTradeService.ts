import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import Trade, { CreateTrade, SummaryTrade } from "@data/operations/Trade";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useTradeService = () => {
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

  const createTrade = useCallback(
    async (trade: CreateTrade): Promise<Trade | null> =>
      safeRequest(() =>
        api.post<Trade>("trades", trade).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getTrade = useCallback(
    async (tradeUUid: string): Promise<Trade | null> =>
      safeRequest(() =>
        api.get<Trade>(`trades/${tradeUUid}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getTrades = useCallback(
    async (
      standUuid?: string,
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryTrade> | null> =>
      safeRequest(() =>
        api
          .get<
            PaginatedResponse<SummaryTrade>
          >("trades", { params: { standUuid, page, size, sort } })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getLast3Trades = useCallback(
    async (): Promise<SummaryTrade[] | null> =>
      safeRequest(() =>
        api.get<SummaryTrade[]>("trades/last3").then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deleteTrade = useCallback(
    async (cardId: string, tradeUuid: string): Promise<void> => {
      await safeRequest(() =>
        api.delete<void>(`trades/${cardId}/${tradeUuid}`),
      );
    },
    [api, safeRequest],
  );

  return { createTrade, getTrade, getTrades, getLast3Trades, deleteTrade };
};

export default useTradeService;
