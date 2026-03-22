import axiosInstance from "./axiosInstance";
import type { LoginRequest, LoginResponse, UserDto } from "./types";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await axiosInstance.post<LoginResponse>("/auth/login", data);
    return res.data;
  },

  getMe: async (): Promise<UserDto> => {
    const res = await axiosInstance.get<UserDto>("/auth/me");
    return res.data;
  },
};
