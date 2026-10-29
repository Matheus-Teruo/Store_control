import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import Trade, { CreateTrade, SummaryTrade } from "@data/operations/Trade";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useTradeService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const createTrade = useCallback(
    async (trade: CreateTrade): Promise<Trade> =>
      safeRequest(() =>
        api.post<Trade>("trades", trade).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getTrade = useCallback(
    async (tradeUUid: string): Promise<Trade> =>
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
      sort?: string,
    ): Promise<PaginatedResponse<SummaryTrade>> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<SummaryTrade>>("trades", {
          params: { standUuid, page, size, sort },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getLast3Trades = useCallback(
    async (): Promise<SummaryTrade[]> =>
      safeRequest(() =>
        api
          .get<SummaryTrade[]>("trades/last3")
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deleteTrade = useCallback(
    async (cardId: string, tradeUuid: string): Promise<void> =>
      safeRequest(() =>
        api
          .delete<void>(`trades/${cardId}/${tradeUuid}`)
          .then((res) => res.data),
      ),
      [api, safeRequest],
  );

  return{
    createTrade,
    getTrade,
    getTrades,
    getLast3Trades,
    deleteTrade
  };
};

export default useTradeService;
