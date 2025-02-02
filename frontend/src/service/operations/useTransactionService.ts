import { useHandleApiError } from "@/axios/handlerApiError";
import useAxios from "@/axios/useAxios";
import Transaction, {
  CreateTransaction,
  SummaryTransaction,
} from "@data/operations/Transaction";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useTransactionService = () => {
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

  const createTransaction = useCallback(
    async (transaction: CreateTransaction): Promise<Transaction | null> =>
      safeRequest(() =>
        api
          .post<Transaction>("transactions", transaction)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getTransaction = useCallback(
    async (transactionUuid: string): Promise<Transaction | null> =>
      safeRequest(() =>
        api
          .get<Transaction>(`transactions/${transactionUuid}`)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getTransactions = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryTransaction> | null> =>
      safeRequest(() =>
        api
          .get<
            PaginatedResponse<SummaryTransaction>
          >("transactions", { params: { page, size, sort } })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getLast3Transactions = useCallback(
    async (): Promise<SummaryTransaction[] | null> =>
      safeRequest(() =>
        api
          .get<SummaryTransaction[]>("transactions/last3")
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deleteTransaction = useCallback(
    async (transactionUuid: string): Promise<void> => {
      await safeRequest(() =>
        api.delete<void>(`transactions/${transactionUuid}`),
      );
    },
    [api, safeRequest],
  );

  return {
    createTransaction,
    getTransaction,
    getTransactions,
    getLast3Transactions,
    deleteTransaction,
  };
};

export default useTransactionService;
