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

export const getCards = async (): Promise<OrderCard[]> => {
  const response = await api.get<OrderCard[]>("cards");
  return response.data;
};

export const getActivesCards = async (): Promise<SummaryOrderCard[]> => {
  const response = await api.get<SummaryOrderCard[]>("cards");
  return response.data;
};
