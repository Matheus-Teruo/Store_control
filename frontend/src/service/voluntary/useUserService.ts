import { useHandleApiError } from "@/axios/handlerApiError";
import useAxios from "@/axios/useAxios";
import User, { LoginVoluntary, SignupVoluntary } from "@data/volunteers/User";
import Voluntary from "@data/volunteers/Voluntary";
import { useCallback } from "react";

const useUserService = () => {
  const api = useAxios();
  const handleApiError = useHandleApiError();

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

  const signupVoluntary = useCallback(
    async (user: SignupVoluntary): Promise<Voluntary | null> =>
      safeRequest(() =>
        api.post<Voluntary>("user/signup", user).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const loginVoluntary = useCallback(
    async (user: LoginVoluntary): Promise<User | null> =>
      safeRequest(() =>
        api.post<User>("user/login", user).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getUser = useCallback(
    async (): Promise<User | null> =>
      safeRequest(() => api.get<User>("/user/check").then((res) => res.data)),
    [api, safeRequest],
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
