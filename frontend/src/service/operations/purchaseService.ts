import api from "@/axios/axios";
import Purchase, {
  CreatePurchase,
  SummaryPurchase,
  UpdatePurchase,
} from "@data/operations/Purchase";

export const createPurchase = async (
  purchase: CreatePurchase,
): Promise<Purchase> => {
  const response = await api.post<Purchase>("purchases", purchase);
  return response.data;
};

export const getPurchase = async (purchaseUuid: string): Promise<Purchase> => {
  const response = await api.get<Purchase>(`purchases/${purchaseUuid}`);
  return response.data;
};

export const getPurchases = async (): Promise<SummaryPurchase[]> => {
  const response = await api.get<SummaryPurchase[]>("purchases");
  return response.data;
};

export const getLast3Purchases = async (): Promise<SummaryPurchase[]> => {
  const response = await api.get<SummaryPurchase[]>("purchases/last3");
  return response.data;
};

export const updatePurchase = async (
  purchase: UpdatePurchase,
): Promise<Purchase> => {
  const response = await api.put<Purchase>("purchases", purchase);
  return response.data;
};

export const deletePurchase = async (purchaseUuid: string): Promise<void> => {
  await api.delete<void>(`purchases/${purchaseUuid}`);
};
