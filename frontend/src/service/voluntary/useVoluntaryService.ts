import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import Voluntary, {
  SummaryVoluntary,
  UpdateVoluntary,
  UpdateVoluntaryFunction,
  UpdateVoluntaryRole,
} from "@/data/volunteers/Voluntary";
import { Message } from "@context/AlertsContext/useAlertsContext";
import { PaginatedResponse } from "@service/PagesType";
import { AxiosError } from "axios";
import { useCallback } from "react";

const useVoluntaryService = () => {
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

  const getVoluntary = useCallback(
    async (voluntaryUuid: string): Promise<Voluntary | null> =>
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
      sort?: "asc" | "desc",
    ): Promise<PaginatedResponse<SummaryVoluntary> | null> =>
      safeRequest(() =>
        api
          .get<PaginatedResponse<SummaryVoluntary>>("/volunteers", {
            params: { page, size, sort },
          })
          .then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const updateVoluntary = useCallback(
    async (voluntary: UpdateVoluntary): Promise<Voluntary | Message | null> =>
      safeRequestWithFeedback(() =>
        api.put<Voluntary>("/volunteers", voluntary).then((res) => res.data),
      ),
    [api, safeRequestWithFeedback],
  );

  const updateVoluntaryFunction = useCallback(
    async (
      voluntary: UpdateVoluntaryFunction,
    ): Promise<Voluntary | Message | null> =>
      safeRequestWithFeedback(() =>
        api
          .put<Voluntary>("/volunteers/function", voluntary)
          .then((res) => res.data),
      ),
    [api, safeRequestWithFeedback],
  );

  const updateVoluntaryRole = useCallback(
    async (
      voluntary: UpdateVoluntaryRole,
    ): Promise<Voluntary | Message | null> =>
      safeRequestWithFeedback(() =>
        api
          .put<Voluntary>("/volunteers/role", voluntary)
          .then((res) => res.data),
      ),
    [api, safeRequestWithFeedback],
  );

  return {
    getVoluntary,
    getVolunteers,
    updateVoluntary,
    updateVoluntaryFunction,
    updateVoluntaryRole,
  };
};

export default useVoluntaryService;
