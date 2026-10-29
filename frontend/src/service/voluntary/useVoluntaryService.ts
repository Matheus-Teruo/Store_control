import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import Voluntary, {
  SummaryVoluntary,
  UpdateVoluntary,
  UpdateVoluntaryFunction,
  UpdateVoluntaryRole,
} from "@/data/volunteers/Voluntary";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useVoluntaryService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const getVoluntary = useCallback(
    async (voluntaryUuid: string): Promise<Voluntary> =>
      safeRequest(() =>
        api
          .get<Voluntary>(`volunteers/${voluntaryUuid}`)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getVolunteers = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: string,
    ): Promise<PaginatedResponse<SummaryVoluntary>> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<SummaryVoluntary>>("/volunteers", {
            params: { page, size, sort },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getListVolunteers = useCallback(
    async (): Promise<SummaryVoluntary[]> =>
      safeRequest(() =>
        api.get<SummaryVoluntary[]>("volunteers/list").then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updateVoluntary = useCallback(
    async (voluntary: UpdateVoluntary): Promise<Voluntary> =>
      safeRequest(() =>
        api.put<Voluntary>("/volunteers", voluntary).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updateVoluntaryFunction = useCallback(
    async (
      voluntary: UpdateVoluntaryFunction,
    ): Promise<Voluntary> =>
      safeRequest(() =>
        api
          .put<Voluntary>("/volunteers/function", voluntary)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updateVoluntaryRole = useCallback(
    async (
      voluntary: UpdateVoluntaryRole,
    ): Promise<Voluntary> =>
      safeRequest(() =>
        api
          .put<Voluntary>("/volunteers/role", voluntary)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updatePassword = useCallback(
    async (voluntaryUuid: string): Promise<Voluntary> =>
      safeRequest(() =>
        api
          .put<Voluntary>("/volunteers/forgot-password", {
            uuid: voluntaryUuid,
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deleteVoluntary = useCallback(
    async (voluntaryUuid: string): Promise<void> =>
      safeRequest(() =>
        api
          .delete<void>(`volunteers/${voluntaryUuid}`)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  return {
    getVoluntary,
    getVolunteers,
    getListVolunteers,
    updateVoluntary,
    updateVoluntaryFunction,
    updateVoluntaryRole,
    updatePassword,
    deleteVoluntary,
  };
};

export default useVoluntaryService;