import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import Card, { RequestCard, SummaryCard } from "@data/customers/Card";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useCardService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const createCard = useCallback(
    async (card: RequestCard): Promise<Card> =>
      safeRequest(() =>
        api.post<Card>("cards", card).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getCard = useCallback(
    async (cardId: string): Promise<Card> =>
      safeRequest(() =>
        api.get<Card>(`cards/${cardId}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getCards = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<Card>> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<Card>>("cards", {params: { page, size, sort },})
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getActivesCards = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryCard>> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<SummaryCard>>("cards/active", {params: { page, size, sort },})
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  return {
    createCard,
    getCard,
    getCards,
    getActivesCards,
  };
};

export default useCardService;