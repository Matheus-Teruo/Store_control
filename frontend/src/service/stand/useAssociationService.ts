import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import Association, {
  CreateAssociation,
  SummaryAssociation,
  UpdateAssociation,
} from "@data/stands/Association";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useAssociationService = () => {
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

  const createAssociation = useCallback(
    async (association: CreateAssociation): Promise<Association | null> =>
      safeRequest(() =>
        api
          .post<Association>("associations", association)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getAssociation = useCallback(
    async (associationUuid: string): Promise<Association | null> =>
      safeRequest(() =>
        api
          .get<Association>(`associations/${associationUuid}`)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getAssociations = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryAssociation> | null> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<SummaryAssociation>>("associations", {
            params: { page, size, sort },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getListAssociations = useCallback(
    async (): Promise<SummaryAssociation[] | null> =>
      safeRequest(() =>
        api
          .get<SummaryAssociation[]>("associations/list")
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updateAssociation = useCallback(
    async (association: UpdateAssociation): Promise<Association | null> =>
      safeRequest(() =>
        api
          .put<Association>("associations", association)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deleteAssociation = useCallback(
    async (associationUuid: string): Promise<void> => {
      await safeRequest(() =>
        api.delete<void>(`associations/${associationUuid}`),
      );
    },
    [api, safeRequest],
  );

  return {
    createAssociation,
    getAssociation,
    getAssociations,
    getListAssociations,
    updateAssociation,
    deleteAssociation,
  };
};

export default useAssociationService;
