import { useApiError } from "@/axios/useApiError";
import useAxios from "@/axios/useAxios";
import { Message } from "@context/AlertsContext/useAlertsContext";
import User, { LoginVoluntary, SignupVoluntary } from "@data/volunteers/User";
import Voluntary from "@data/volunteers/Voluntary";
import { AxiosError } from "axios";
import { useCallback } from "react";

const useUserService = () => {
  const api = useAxios();
  const handleApiError = useApiError();

  const safeRequest = useCallback(
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

  const signupVoluntary = useCallback(
    async (user: SignupVoluntary): Promise<Voluntary | Message | null> =>
      safeRequest(() =>
        api.post<Voluntary>("user/signup", user).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const loginVoluntary = useCallback(
    async (user: LoginVoluntary): Promise<User | Message | null> =>
      safeRequest(() =>
        api.post<User>("user/login", user).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getUser = useCallback(
    async (): Promise<User | null> =>
      api.get<User>("/user/check").then((res) => res.data),
    [api],
  );

  const logoutVoluntary = useCallback(async (): Promise<void> => {
    await safeRequest(() => api.post<void>("/user/logout").then(() => {}));
  }, [api, safeRequest]);

  return {
    signupVoluntary,
    loginVoluntary,
    getUser,
    logoutVoluntary,
  };
};

export default useUserService;
