import api from "@/axios/axios";
import Customer, {
  CustomerFinalization,
  CustomerOrder,
  SummaryCustomer,
} from "@data/customers/Customer";

export const getCustomer = async (customerUuid: string): Promise<Customer> => {
  const response = await api.get<Customer>(`customers/${customerUuid}`);
  return response.data;
};

export const getCustomerbyCard = async (
  cardId: string,
): Promise<CustomerOrder> => {
  const response = await api.get<CustomerOrder>(`customers/card/${cardId}`);
  return response.data;
};

export const getCustomers = async (
  page?: number,
  size?: number,
  sort?: "asc" | "desc",
): Promise<SummaryCustomer[]> => {
  const response = await api.get<SummaryCustomer[]>("customers", {
    params: {
      page: page,
      size: size,
      sort: sort,
    },
  });
  return response.data;
};

export const getActiveCustomers = async (
  page?: number,
  size?: number,
  sort?: "asc" | "desc",
): Promise<SummaryCustomer[]> => {
  const response = await api.get<SummaryCustomer[]>("customers/active", {
    params: {
      page: page,
      size: size,
      sort: sort,
    },
  });
  return response.data;
};

export const finalizateCustomer = async (
  customerFinalizate: CustomerFinalization,
): Promise<Customer> => {
  const response = await api.post<Customer>(
    "customers/finalize",
    customerFinalizate,
  );
  return response.data;
};

export const undoFinalizateCustomer = async (
  cardId: string,
): Promise<Customer> => {
  const response = await api.delete<Customer>(`customers/finalize/${cardId}`);
  return response.data;
};
