import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import Stand, {
  CreateStand,
  SummaryStand,
  UpdateStand,
} from "@data/stands/Stand";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useStandService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const createStand = useCallback(
    async (stand: CreateStand): Promise<Stand> =>
      safeRequest(() =>
        api.post<Stand>("stands", stand).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getStand = useCallback(
    async (standUuid: string): Promise<Stand> =>
      safeRequest(() =>
        api.get<Stand>(`stands/${standUuid}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getStands = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: string,
    ): Promise<PaginatedResponse<SummaryStand>> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<SummaryStand>>("stands", {
            params: { page, size, sort },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getListStands = useCallback(
    async (): Promise<SummaryStand[]> =>
      safeRequest(() =>
        api.get<SummaryStand[]>("stands/list").then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updateStand = useCallback(
    async (stand: UpdateStand): Promise<Stand> =>
      safeRequest(() =>
        api.put<Stand>("stands", stand).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deleteStand = useCallback(
    async (standUuid: string): Promise<void> =>
      safeRequest(() =>
        api
          .delete<void>(`stands/${standUuid}`)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  return {
    createStand,
    getStand,
    getStands,
    getListStands,
    updateStand,
    deleteStand,
  };
};

export default useStandService;