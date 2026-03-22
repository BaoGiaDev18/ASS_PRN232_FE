import axiosInstance from "./axiosInstance";
import type { GroupDto, GroupDetailDto, GroupRequest } from "./types";

export const groupService = {
  getAll: async (): Promise<GroupDto[]> => {
    const res = await axiosInstance.get<GroupDto[]>("/groups");
    return res.data;
  },

  getById: async (id: string): Promise<GroupDetailDto> => {
    const res = await axiosInstance.get<GroupDetailDto>(`/groups/${id}`);
    return res.data;
  },

  create: async (data: GroupRequest): Promise<GroupDto> => {
    const res = await axiosInstance.post<GroupDto>("/groups", data);
    return res.data;
  },

  update: async (id: string, data: GroupRequest): Promise<void> => {
    await axiosInstance.put(`/groups/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/groups/${id}`);
  },

  addMember: async (groupId: string, studentId: string): Promise<void> => {
    await axiosInstance.post(`/groups/${groupId}/members`, { studentId });
  },

  removeMember: async (groupId: string, studentId: string): Promise<void> => {
    await axiosInstance.delete(`/groups/${groupId}/members/${studentId}`);
  },
};
