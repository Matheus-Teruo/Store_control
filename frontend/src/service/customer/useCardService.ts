import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import Card, { RequestCard, SummaryCard } from "@data/customers/Card";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useCardService = () => {
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

  const createCard = useCallback(
    async (card: RequestCard): Promise<Card | null> =>
      safeRequest(() => api.post<Card>("cards", card).then((res) => res.data)),
    [api, safeRequest],
  );

  const getCard = useCallback(
    async (cardId: string): Promise<Card | null> =>
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
    ): Promise<PaginatedResponse<Card> | null> =>
      safeRequest(() =>
        api
          .get<
            PaginatedResponse<Card>
          >("cards", { params: { page, size, sort } })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getActivesCards = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryCard> | null> =>
      safeRequest(() =>
        api
          .get<
            PaginatedResponse<SummaryCard>
          >("cards/active", { params: { page, size, sort } })
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
