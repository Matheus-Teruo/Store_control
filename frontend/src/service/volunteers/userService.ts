import api from "@/axios/axios";
import User, { LoginVoluntary, SignupVoluntary } from "@data/volunteers/User";
import Voluntary from "@data/volunteers/Voluntary";

export const signupVoluntary = async (
  user: SignupVoluntary,
): Promise<Voluntary> => {
  const response = await api.post<Voluntary>("user/signup", user);
  return response.data;
};

export const loginVoluntary = async (user: LoginVoluntary): Promise<User> => {
  const response = await api.post<User>("user/login", user);
  return response.data;
};

export const getUser = async (): Promise<User> => {
  const response = await api.get<User>("/user/check");
  return response.data;
};

export const LogoutVoluntary = async (): Promise<void> => {
  const response = await api.post<void>("/user/logout");
  return response.data;
};
