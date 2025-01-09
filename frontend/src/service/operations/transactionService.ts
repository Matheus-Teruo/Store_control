import api from "@/axios/axios";
import Transaction, {
  CreateTransaction,
  SummaryTransaction,
} from "@data/operations/Transaction";

export const createTransaction = async (
  transaction: CreateTransaction,
): Promise<Transaction> => {
  const response = await api.post<Transaction>("transactions", transaction);
  return response.data;
};

export const getTransaction = async (
  transactionUuid: string,
): Promise<Transaction> => {
  const response = await api.get<Transaction>(
    `transactions/${transactionUuid}`,
  );
  return response.data;
};

export const getTransactions = async (): Promise<SummaryTransaction[]> => {
  const response = await api.get<SummaryTransaction[]>("transactions");
  return response.data;
};

export const getLast3Transactions = async (): Promise<SummaryTransaction[]> => {
  const response = await api.get<SummaryTransaction[]>("transactions/last3");
  return response.data;
};

export const deleteTransaction = async (
  transactionUuid: string,
): Promise<void> => {
  await api.delete<void>(`transactions/${transactionUuid}`);
};
