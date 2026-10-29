import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import Tag, { CreateTag, UpdateTag } from "@data/stands/Tag";
import { PaginatedResponse } from "@service/PagesType";
import { useCallback } from "react";

const useTagService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const createTag = useCallback(
    async (tag: CreateTag): Promise<Tag> =>
      safeRequest(() =>
        api.post<Tag>("tags", tag).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getTags = useCallback(
    async (
      page?: number,
      size?: number,
      sort?: string,
    ): Promise<PaginatedResponse<Tag>> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<Tag>>("tags", {
            params: { page, size, sort },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getListTags = useCallback(
    async (): Promise<Tag[]> =>
      safeRequest(() =>
        api.get<Tag[]>("tags/list").then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updateTag = useCallback(
    async (tag: UpdateTag): Promise<Tag> =>
      safeRequest(() =>
        api.put<Tag>("tags", tag).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const deleteTag = useCallback(
    async (tagUuid: string): Promise<void> =>
      safeRequest(() =>
        api.delete<void>(`tags/${tagUuid}`).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  return {
    createTag,
    getTags,
    getListTags,
    updateTag,
    deleteTag
  };
};

export default useTagService;
