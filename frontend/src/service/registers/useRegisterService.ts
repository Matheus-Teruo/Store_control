import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import Register, {
  CreateRegister,
  SummaryRegister,
  UpdateRegister,
} from "@data/registers/Register";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useRegisterService = () => {
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

  const createRegister = useCallback(
    async (register: CreateRegister): Promise<Register | null> =>
      safeRequest(() =>
        api.post<Register>("registers", register).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getRegister = useCallback(
    async (registerUuid: string): Promise<Register | null> =>
      safeRequest(() =>
        api.get<Register>(`registers/${registerUuid}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getRegisters = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryRegister> | null> =>
      safeRequest(() =>
        api
          .get<
            PaginatedResponse<SummaryRegister>
          >("registers", { params: { page, size, sort } })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getListRegisters = useCallback(
    async (): Promise<SummaryRegister[] | null> =>
      safeRequest(() =>
        api.get<SummaryRegister[]>("registers/list").then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updateRegister = useCallback(
    async (register: UpdateRegister): Promise<Register | null> =>
      safeRequest(() =>
        api.put<Register>("registers", register).then((res) => res.data),
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

export default useRegisterService;
