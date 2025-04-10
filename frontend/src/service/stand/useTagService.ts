import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import { Message } from "@context/AlertsContext/useAlertsContext";
import Tag, { CreateTag, UpdateTag } from "@data/stands/Tag";
import { AxiosError } from "axios";
import { useCallback } from "react";

const useTagService = () => {
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

  const createTag = useCallback(
    async (tag: CreateTag): Promise<Tag | Message | null> =>
      safeRequestWithFeedback(() =>
        api.post<Tag>("tags", tag).then((res) => res.data),
      ),
    [api, safeRequestWithFeedback],
  );

  const getListTags = useCallback(
    async (): Promise<Tag[] | null> =>
      safeRequest(() => api.get<Tag[]>("tags").then((res) => res.data)),
    [api, safeRequest],
  );

  const updateStand = useCallback(
    async (tag: UpdateTag): Promise<Tag | Message | null> =>
      safeRequestWithFeedback(() =>
        api.put<Tag>("tags", tag).then((res) => res.data),
      ),
    [api, safeRequestWithFeedback],
  );

  const deleteTag = useCallback(
    async (tagUuid: string): Promise<void> => {
      await safeRequest(() => api.delete<void>(`tags/${tagUuid}}`));
    },
    [api, safeRequest],
  );

  return { createTag, getListTags, updateStand, deleteTag };
};

export default useTagService;
