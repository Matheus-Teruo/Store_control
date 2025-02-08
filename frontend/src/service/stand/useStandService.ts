import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import Stand, {
  CreateStand,
  SummaryStand,
  UpdateStand,
} from "@data/stands/Stand";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useStandService = () => {
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

  const createStand = useCallback(
    async (stand: CreateStand): Promise<Stand | null> =>
      safeRequest(() =>
        api.post<Stand>("stands", stand).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getStand = useCallback(
    async (standUuid: string): Promise<Stand | null> =>
      safeRequest(() =>
        api.get<Stand>(`stands/${standUuid}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getStands = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryStand> | null> =>
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
    async (): Promise<SummaryStand[] | null> =>
      safeRequest(() =>
        api.get<SummaryStand[]>("stands/list").then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updateStand = useCallback(
    async (stand: UpdateStand): Promise<Stand | null> =>
      safeRequest(() =>
        api.put<Stand>("stands", stand).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deleteStand = useCallback(
    async (standUuid: string): Promise<void> => {
      await safeRequest(() => api.delete<void>(`stands/${standUuid}`));
    },
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
