import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import Customer, {
  CustomerFinalization,
  CustomerOrder,
  SummaryCustomer,
} from "@data/customers/Customer";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useCustomerService = () => {
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

  const getCustomer = useCallback(
    async (customerUuid: string): Promise<Customer | null> =>
      safeRequest(() =>
        api.get<Customer>(`customers/${customerUuid}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getCustomerByCard = useCallback(
    async (cardId: string): Promise<CustomerOrder | null> =>
      safeRequest(() =>
        api
          .get<CustomerOrder>(`customers/card/${cardId}`)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getCustomers = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryCustomer> | null> =>
      safeRequest(() =>
        api
          .get<
            PaginatedResponse<SummaryCustomer>
          >("customers", { params: { page, size, sort } })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getActiveCustomers = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryCustomer> | null> =>
      safeRequest(() =>
        api
          .get<
            PaginatedResponse<SummaryCustomer>
          >("customers/active", { params: { page, size, sort } })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const finalizeCustomer = useCallback(
    async (
      customerFinalization: CustomerFinalization,
    ): Promise<Customer | null> =>
      safeRequest(() =>
        api
          .post<Customer>("customers/finalize", customerFinalization)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const undoFinalizeCustomer = useCallback(
    async (cardId: string): Promise<Customer | null> =>
      safeRequest(() =>
        api
          .delete<Customer>(`customers/finalize/${cardId}`)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  return {
    getCustomer,
    getCustomerByCard,
    getCustomers,
    getActiveCustomers,
    finalizeCustomer,
    undoFinalizeCustomer,
  };
};

export default useCustomerService;
