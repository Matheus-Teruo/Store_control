import useAxios from "@/axios/useAxios";
import { useSafeRequest } from "@/axios/useHandleRequest";
import User, { LoginVoluntary, SignupVoluntary } from "@data/volunteers/User";
import Voluntary from "@data/volunteers/Voluntary";
import { useCallback } from "react";

const useUserService = () => {
  const api = useAxios();
  const { safeRequest } = useSafeRequest();

  const signupVoluntary = useCallback(
    async (user: SignupVoluntary): Promise<Voluntary> =>
      safeRequest(() =>
        api.post<Voluntary>("user/signup", user).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const loginVoluntary = useCallback(
    async (user: LoginVoluntary): Promise<User> =>
      safeRequest(() =>
        api.post<User>("user/login", user).then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const getUser = useCallback(
    async (): Promise<User> =>
      safeRequest(() =>
        api.get<User>("/user/check").then((res) => res.data),
      ),
    [api, safeRequest],
  );

  const logoutVoluntary = useCallback(
    async (): Promise<void> =>
      safeRequest(() =>
        api.post<void>("/user/logout").then((res) => res.data),
      ),
    [api, safeRequest],
  );

  return {
    signupVoluntary,
    loginVoluntary,
    getUser,
    logoutVoluntary,
  };
};

export default useUserService;
