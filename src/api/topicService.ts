import axiosInstance from "./axiosInstance";
import type { TopicDto, TopicRequest } from "./types";

export const topicService = {
  getAll: async (): Promise<TopicDto[]> => {
    const res = await axiosInstance.get<TopicDto[]>("/topics");
    return res.data;
  },

  create: async (data: TopicRequest): Promise<TopicDto> => {
    const res = await axiosInstance.post<TopicDto>("/topics", data);
    return res.data;
  },

  update: async (id: string, data: TopicRequest): Promise<void> => {
    await axiosInstance.put(`/topics/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/topics/${id}`);
  },
};
