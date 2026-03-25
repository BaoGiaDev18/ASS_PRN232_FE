import axiosInstance from "./axiosInstance";
import type {
  QuestionListDto,
  QuestionDetailDto,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  NotificationDto,
} from "./types";

export const studentService = {
  getQuestions: async (params?: {
    status?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
  }): Promise<QuestionListDto[]> => {
    const res = await axiosInstance.get<QuestionListDto[]>(
      "/student/questions",
      { params },
    );
    return res.data;
  },

  getQuestionDetail: async (id: string): Promise<QuestionDetailDto> => {
    const res = await axiosInstance.get<QuestionDetailDto>(
      `/student/questions/${id}`,
    );
    return res.data;
  },

  createQuestion: async (
    data: CreateQuestionRequest,
  ): Promise<{ questionId: string }> => {
    const res = await axiosInstance.post<{ questionId: string }>(
      "/student/questions",
      data,
    );
    return res.data;
  },

  updateQuestion: async (
    id: string,
    data: UpdateQuestionRequest,
  ): Promise<void> => {
    await axiosInstance.put(`/student/questions/${id}`, data);
  },

  getNotifications: async (isRead?: boolean): Promise<NotificationDto[]> => {
    const res = await axiosInstance.get<NotificationDto[]>(
      "/student/notifications",
      { params: isRead !== undefined ? { isRead } : undefined },
    );
    return res.data;
  },

  markNotificationRead: async (id: string): Promise<void> => {
    await axiosInstance.post(`/student/notifications/${id}/read`);
  },
};
