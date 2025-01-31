import api from "@/axios/axios";
import Customer from "@data/customers/Customer";
import Trade, { CreateTrade } from "@data/operations/Trade";

export const createTrade = async (trade: CreateTrade): Promise<Trade> => {
  const response = await api.post<Trade>("trades", trade);
  return response.data;
};

export const deleteTrade = async (cardId: string): Promise<Customer> => {
  const response = await api.delete<Customer>(`trades/${cardId}`);
  return response.data;
};
