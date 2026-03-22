import axiosInstance from "./axiosInstance";
import type { HistoryResponseDto } from "./types";

export const historyService = {
  getAll: async (params?: {
    status?: string;
    topic_id?: string;
    group_id?: string;
    from_date?: string;
    to_date?: string;
    search?: string;
  }): Promise<HistoryResponseDto> => {
    const res = await axiosInstance.get<HistoryResponseDto>("/admin/history", {
      params,
    });
    return res.data;
  },
};
