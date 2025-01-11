import api from "@/axios/axios";
import Product, {
  CreateProduct,
  SummaryProduct,
  UpdateProduct,
} from "@data/stands/Product";
import { PaginatedResponse } from "@service/PagesType";

export const createProduct = async (
  product: CreateProduct,
): Promise<Product> => {
  const response = await api.post<Product>("products", product);
  return response.data;
};

export const getProduct = async (productUuid: string): Promise<Product> => {
  const response = await api.get<Product>(`products/${productUuid}`);
  return response.data;
};

export const getProducts = async (
  productName?: string,
  standUuid?: string,
  page?: number,
  size?: number,
  sort?: "asc" | "desc",
): Promise<PaginatedResponse<SummaryProduct>> => {
  const response = await api.get<PaginatedResponse<SummaryProduct>>(
    "products",
    {
      params: {
        productName: productName,
        standUuid: standUuid,
        page: page,
        size: size,
        sort: sort,
      },
    },
  );
  return response.data;
};

export const getListProducts = async (): Promise<SummaryProduct[]> => {
  const response = await api.get<SummaryProduct[]>("products/list");
  return response.data;
};

export const updateProduct = async (
  product: UpdateProduct,
): Promise<Product> => {
  const response = await api.put<Product>("products", product);
  return response.data;
};

export const deleteProduct = async (productUuid: string): Promise<void> => {
  await api.delete<void>(`products/${productUuid}`);
};
