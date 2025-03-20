import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import { Message } from "@context/AlertsContext/useAlertsContext";
import Association, {
  CreateAssociation,
  SummaryAssociation,
  UpdateAssociation,
} from "@data/stands/Association";
import { PaginatedResponse } from "@service/PagesType";
import { AxiosError } from "axios";
import { useCallback } from "react";

const useAssociationService = () => {
  const api = useAxios();
  const handleApiError = useApiError();

  const safeRequestWithFeedback = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | Message | null> => {
      try {
        return await fn();
      } catch (error) {
        handleApiError(error);
        if (error instanceof AxiosError) {
          return error.response!.data as Message;
        }
        return null;
      }
    },
    [handleApiError],
  );

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
    async (
      association: CreateAssociation,
    ): Promise<Association | Message | null> =>
      safeRequestWithFeedback(() =>
        api
          .post<Association>("associations", association)
          .then((res) => res.data),
      ),
    [api, safeRequestWithFeedback],
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
    async (
      association: UpdateAssociation,
    ): Promise<Association | Message | null> =>
      safeRequestWithFeedback(() =>
        api
          .put<Association>("associations", association)
          .then((res) => res.data),
      ),
    [api, safeRequestWithFeedback],
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
