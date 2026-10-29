import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import Association, {
  CreateAssociation,
  SummaryAssociation,
  UpdateAssociation,
} from "@data/stands/Association";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useAssociationService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const createAssociation = useCallback(
    async (
      association: CreateAssociation,
    ): Promise<Association> =>
      safeRequest(() =>
        api
          .post<Association>("associations", association)
          .then((res) => res.data),
      ),
    [api, safeRequest,
],
  );

  const getAssociation = useCallback(
    async (associationUuid: string): Promise<Association> =>
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
      sort?: string,
    ): Promise<PaginatedResponse<SummaryAssociation>> =>
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
    async (): Promise<SummaryAssociation[]> =>
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
    ): Promise<Association> =>
      safeRequest(() =>
        api
          .put<Association>("associations", association)
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deleteAssociation = useCallback(
    async (associationUuid: string): Promise<void> =>
      safeRequest(() =>
        api
          .delete<void>(`associations/${associationUuid}`)
          .then((res) => res.data),
      ),
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