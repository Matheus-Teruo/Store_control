import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import Purchase, {
  CreatePurchase,
  SummaryPurchase,
  UpdatePurchase,
} from "@data/operations/Purchase";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const usePurchaseService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const createPurchase = useCallback(
    async (purchase: CreatePurchase): Promise<Purchase> =>
      safeRequest(() =>
        api.post<Purchase>("purchases", purchase).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getPurchase = useCallback(
    async (purchaseUuid: string): Promise<Purchase> =>
      safeRequest(() =>
        api
          .get<Purchase>(`purchases/${purchaseUuid}`)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getPurchases = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: string,
    ): Promise<PaginatedResponse<SummaryPurchase>> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<SummaryPurchase>>("purchases", {
          params: { page, size, sort },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getLast3Purchases = useCallback(
    async (): Promise<SummaryPurchase[]> =>
      safeRequest(() =>
        api.get<SummaryPurchase[]>("purchases/last3").then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updatePurchase = useCallback(
    async (purchase: UpdatePurchase): Promise<Purchase> =>
      safeRequest(() =>
        api.put<Purchase>("purchases", purchase).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deletePurchase = useCallback(
    async (purchaseUuid: string): Promise<void> => 
      safeRequest(() =>
        api.delete<void>(`purchases/${purchaseUuid}`).then((res) => res.data),
      ),
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
