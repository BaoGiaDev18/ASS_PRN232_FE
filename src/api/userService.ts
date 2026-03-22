import axiosInstance from "./axiosInstance";
import type { User, CreateUserRequest, UpdateUserRequest } from "./types";

export const userService = {
  getAll: async (role?: string, unassigned?: boolean): Promise<User[]> => {
    const params: Record<string, string> = {};
    if (role) params.role = role;
    if (unassigned) params.unassigned = "true";
    const res = await axiosInstance.get<User[]>("/users", { params });
    return res.data;
  },

  getById: async (id: string): Promise<User> => {
    const res = await axiosInstance.get<User>(`/users/${id}`);
    return res.data;
  },

  create: async (data: CreateUserRequest): Promise<User> => {
    const res = await axiosInstance.post<User>("/users", data);
    return res.data;
  },

  update: async (id: string, data: UpdateUserRequest): Promise<void> => {
    await axiosInstance.put(`/users/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },
};
