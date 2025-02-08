import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import OrderCard, {
  RequestOrderCard,
  SummaryOrderCard,
} from "@data/customers/OrderCard";
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
    async (card: RequestOrderCard): Promise<OrderCard | null> =>
      safeRequest(() =>
        api.post<OrderCard>("cards", card).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getCard = useCallback(
    async (cardId: string): Promise<OrderCard | null> =>
      safeRequest(() =>
        api.get<OrderCard>(`cards/${cardId}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getCards = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<OrderCard> | null> =>
      safeRequest(() =>
        api
          .get<
            PaginatedResponse<OrderCard>
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
    ): Promise<PaginatedResponse<SummaryOrderCard> | null> =>
      safeRequest(() =>
        api
          .get<
            PaginatedResponse<SummaryOrderCard>
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
