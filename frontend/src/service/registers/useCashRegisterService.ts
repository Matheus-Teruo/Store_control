import { useHandleApiError } from "@/axios/handlerApiError";
import useAxios from "@/axios/useAxios";
import CashRegister, {
  CreateCashRegister,
  SummaryCashRegister,
  UpdateCashRegister,
} from "@data/registers/CashRegister";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useCashRegisterService = () => {
  const api = useAxios();
  const handleApiError = useHandleApiError();

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

  const createRegister = useCallback(
    async (register: CreateCashRegister): Promise<CashRegister | null> =>
      safeRequest(() =>
        api.post<CashRegister>("registers", register).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getRegister = useCallback(
    async (registerUuid: string): Promise<CashRegister | null> =>
      safeRequest(() =>
        api
          .get<CashRegister>(`registers/${registerUuid}`)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getRegisters = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryCashRegister> | null> =>
      safeRequest(() =>
        api
          .get<
            PaginatedResponse<SummaryCashRegister>
          >("registers", { params: { page, size, sort } })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getListRegisters = useCallback(
    async (): Promise<SummaryCashRegister[] | null> =>
      safeRequest(() =>
        api
          .get<SummaryCashRegister[]>("registers/list")
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updateRegister = useCallback(
    async (register: UpdateCashRegister): Promise<CashRegister | null> =>
      safeRequest(() =>
        api.put<CashRegister>("registers", register).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deleteRegister = useCallback(
    async (registerUuid: string): Promise<void> => {
      await safeRequest(() => api.delete<void>(`registers/${registerUuid}`));
    },
    [api, safeRequest],
  );

  return {
    createRegister,
    getRegister,
    getRegisters,
    getListRegisters,
    updateRegister,
    deleteRegister,
  };
};

export default useCashRegisterService;
