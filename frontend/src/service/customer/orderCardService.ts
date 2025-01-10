import api from "@/axios/axios";
import OrderCard, {
  RequestOrderCard,
  SummaryOrderCard,
} from "@data/customers/OrderCard";

export const createCard = async (
  card: RequestOrderCard,
): Promise<OrderCard> => {
  const response = await api.post<OrderCard>("cards", card);
  return response.data;
};

export const getCard = async (cardId: string): Promise<OrderCard> => {
  const response = await api.get<OrderCard>(`cards/${cardId}`);
  return response.data;
};

export const getCards = async (
  page?: number,
  size?: number,
  sort?: "asc" | "desc",
): Promise<OrderCard[]> => {
  const response = await api.get<OrderCard[]>("cards", {
    params: {
      page: page,
      size: size,
      sort: sort,
    },
  });
  return response.data;
};

export const getActivesCards = async (
  page?: number,
  size?: number,
  sort?: "asc" | "desc",
): Promise<SummaryOrderCard[]> => {
  const response = await api.get<SummaryOrderCard[]>("cards/active", {
    params: {
      page: page,
      size: size,
      sort: sort,
    },
  });
  return response.data;
};
