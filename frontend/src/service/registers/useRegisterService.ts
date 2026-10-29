import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import Register, {
  CreateRegister,
  SummaryRegister,
  UpdateRegister,
} from "@data/registers/Register";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useRegisterService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const createRegister = useCallback(
    async (register: CreateRegister): Promise<Register> =>
      safeRequest(() =>
        api.post<Register>("registers", register).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getRegister = useCallback(
    async (registerUuid: string): Promise<Register> =>
      safeRequest(() =>
        api.get<Register>(`registers/${registerUuid}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getRegisters = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: string,
    ): Promise<PaginatedResponse<SummaryRegister>> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<SummaryRegister>>("registers", {
            params: { page, size, sort },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getListRegisters = useCallback(
    async (): Promise<SummaryRegister[]> =>
      safeRequest(() =>
        api.get<SummaryRegister[]>("registers/list").then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updateRegister = useCallback(
    async (register: UpdateRegister): Promise<Register> =>
      safeRequest(() =>
        api.put<Register>("registers", register).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deleteRegister = useCallback(
    async (registerUuid: string): Promise<void> =>
      safeRequest(() =>
        api
          .delete<void>(`registers/${registerUuid}`)
          .then((res) => res.data),
      ),
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
