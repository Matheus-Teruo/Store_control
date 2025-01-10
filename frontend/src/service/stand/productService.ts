import api from "@/axios/axios";
import Product, {
  CreateProduct,
  SummaryProduct,
  UpdateProduct,
} from "@data/stands/Product";

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
  page: number = 0,
  size: number = 20,
  sort?: "asc" | "desc",
): Promise<SummaryProduct[]> => {
  const response = await api.get<SummaryProduct[]>("products", {
    params: { page: page, size: size, sort: sort },
  });
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
