import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import Purchase, {
  CreatePurchase,
  SummaryPurchase,
  UpdatePurchase,
} from "@data/operations/Purchase";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const usePurchaseService = () => {
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

  const createPurchase = useCallback(
    async (purchase: CreatePurchase): Promise<Purchase | null> =>
      safeRequest(() =>
        api.post<Purchase>("purchases", purchase).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getPurchase = useCallback(
    async (purchaseUuid: string): Promise<Purchase | null> =>
      safeRequest(() =>
        api.get<Purchase>(`purchases/${purchaseUuid}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getPurchases = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryPurchase> | null> =>
      safeRequest(() =>
        api
          .get<
            PaginatedResponse<SummaryPurchase>
          >("purchases", { params: { page, size, sort } })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getLast3Purchases = useCallback(
    async (): Promise<SummaryPurchase[] | null> =>
      safeRequest(() =>
        api.get<SummaryPurchase[]>("purchases/last3").then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updatePurchase = useCallback(
    async (purchase: UpdatePurchase): Promise<Purchase | null> =>
      safeRequest(() =>
        api.put<Purchase>("purchases", purchase).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deletePurchase = useCallback(
    async (purchaseUuid: string): Promise<void> => {
      await safeRequest(() => api.delete<void>(`purchases/${purchaseUuid}`));
    },
    [api, safeRequest],
  );

  return {
    createPurchase,
    getPurchase,
    getPurchases,
    getLast3Purchases,
    updatePurchase,
    deletePurchase,
  };
};

export default usePurchaseService;
