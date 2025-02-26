import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import { resizeImage } from "@/utils/cropImage";
import { Message } from "@context/AlertsContext/useAlertsContext";
import Product, {
  CreateProduct,
  ResponseImage,
  SummaryProduct,
  UpdateProduct,
} from "@data/stands/Product";
import { PaginatedResponse } from "@service/PagesType";
import { AxiosError } from "axios";
import { useCallback } from "react";

const useProductService = () => {
  const api = useAxios();
  const handleApiError = useApiError();

  const safeRequestWithFeedback = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | Message | null> => {
      try {
        return await fn();
      } catch (error) {
        handleApiError(error);
        if (error instanceof AxiosError) {
          return error.response!.data as Message;
        }
        return null;
      }
    },
    [handleApiError],
  );

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

  const createProduct = useCallback(
    async (product: CreateProduct): Promise<Product | Message | null> =>
      safeRequestWithFeedback(() =>
        api.post<Product>("products", product).then((res) => res.data),
      ),
    [api, safeRequestWithFeedback],
  );

  const getProduct = useCallback(
    async (productUuid: string): Promise<Product | null> =>
      safeRequest(() =>
        api.get<Product>(`products/${productUuid}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getProducts = useCallback(
    async (
      productName?: string,
      standUuid?: string,
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryProduct> | null> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<SummaryProduct>>("products", {
            params: { productName, standUuid, page, size, sort },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getListProducts = useCallback(
    async (): Promise<SummaryProduct[] | null> =>
      safeRequest(() =>
        api.get<SummaryProduct[]>("products/list").then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updateProduct = useCallback(
    async (product: UpdateProduct): Promise<Product | Message | null> =>
      safeRequestWithFeedback(() =>
        api.put<Product>("products", product).then((res) => res.data),
      ),
    [api, safeRequestWithFeedback],
  );

  const deleteProduct = useCallback(
    async (productUuid: string): Promise<void> => {
      await safeRequestWithFeedback(() =>
        api.delete<void>(`products/${productUuid}`),
      );
    },
    [api, safeRequestWithFeedback],
  );

  const uploadImage = useCallback(
    async (imageData: File): Promise<ResponseImage | null> => {
      const resizedFile = await resizeImage(imageData, 800);
      const formData = new FormData();
      formData.append("image", resizedFile, "cropped-image.png");
      return safeRequest(() =>
        api
          .post<ResponseImage>("products/upload-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => res.data),
      );
    },
    [api, safeRequest],
  );

  return {
    createProduct,
    getProduct,
    getProducts,
    getListProducts,
    updateProduct,
    deleteProduct,
    uploadImage,
  };
};

export default useProductService;
