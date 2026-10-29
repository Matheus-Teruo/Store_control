import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import Customer, {
  CustomerFinalization,
  CustomerCard,
  SummaryCustomer,
} from "@data/customers/Customer";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useCustomerService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const getCustomer = useCallback(
    async (customerUuid: string): Promise<Customer> =>
      safeRequest(() =>
        api
          .get<Customer>(`customers/${customerUuid}`)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getCustomerByCard = useCallback(
    async (cardId: string): Promise<CustomerCard> =>
      safeRequest(() =>
        api
          .get<CustomerCard>(`customers/card/${cardId}`)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getCustomers = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryCustomer>> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<SummaryCustomer>>("customers", {
          params: { page, size, sort },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getActiveCustomers = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryCustomer>> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<SummaryCustomer>>("customers/active", {
          params: { page, size, sort },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const finalizeCustomer = useCallback(
    async (
      customerFinalization: CustomerFinalization,
    ): Promise<Customer> =>
      safeRequest(() =>
        api
          .post<Customer>("customers/finalize", customerFinalization)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const undoFinalizeCustomer = useCallback(
    async (cardId: string): Promise<Customer> =>
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
