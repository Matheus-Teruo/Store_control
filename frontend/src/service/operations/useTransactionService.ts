import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import Transaction, {
  CreateTransaction,
  SummaryTransaction,
} from "@data/operations/Transaction";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useTransactionService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const createTransaction = useCallback(
    async (transaction: CreateTransaction): Promise<Transaction> =>
      safeRequest(() =>
        api
          .post<Transaction>("transactions", transaction)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getTransaction = useCallback(
    async (transactionUuid: string): Promise<Transaction> =>
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
      sort?: string,
    ): Promise<PaginatedResponse<SummaryTransaction>> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<SummaryTransaction>>("transactions", {
            params: { page, size, sort },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getLast3Transactions = useCallback(
    async (): Promise<SummaryTransaction[]> =>
      safeRequest(() =>
        api
          .get<SummaryTransaction[]>("transactions/last3")
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deleteTransaction = useCallback(
    async (transactionUuid: string): Promise<void> =>
      safeRequest(() =>
        api
          .delete<void>(`transactions/${transactionUuid}`)
          .then((res) => res.data),
      ),
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
