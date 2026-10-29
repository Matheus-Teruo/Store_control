import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import { resizeImage } from "@/utils/cropImage";
import Product, {
  CreateProduct,
  ResponseImage,
  SummaryProduct,
  UpdateProduct,
} from "@data/stands/Product";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useProductService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const createProduct = useCallback(
    async (product: CreateProduct): Promise<Product> =>
      safeRequest(() =>
        api.post<Product>("products", product).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getProduct = useCallback(
    async (productUuid: string): Promise<Product> =>
      safeRequest(() =>
        api.get<Product>(`products/${productUuid}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getProducts = useCallback(
    async (
      standUuid?: string,
      productName?: string,
      tagUuid?: string,
      page?: number,
      size?: number,
      sort?: string,
    ): Promise<PaginatedResponse<SummaryProduct>> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<SummaryProduct>>("products", {
            params: {
              standUuid: standUuid != "" ? standUuid : undefined,
              productName: productName != "" ? productName : undefined,
              tagUuid: tagUuid != "" ? tagUuid : undefined,
              page,
              size,
              sort,
            },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getListProducts = useCallback(
    async (standUuid: string): Promise<SummaryProduct[]> =>
      safeRequest(() =>
        api
          .get<SummaryProduct[]>(`products/list/${standUuid}`)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updateProduct = useCallback(
    async (product: UpdateProduct): Promise<Product> =>
      safeRequest(() =>
        api.put<Product>("products", product).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deleteProduct = useCallback(
    async (productUuid: string): Promise<void> =>
      safeRequest(() =>
        api
          .delete<void>(`products/${productUuid}`)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const uploadImage = useCallback(
    async (imageData: File): Promise<ResponseImage> => {
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
