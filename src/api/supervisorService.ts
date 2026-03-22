import axiosInstance from "./axiosInstance";
import type {
  SupervisorGroupDto,
  QuestionListDto,
  QuestionDetailDto,
} from "./types";

export const supervisorService = {
  getMyGroups: async (): Promise<SupervisorGroupDto[]> => {
    const res = await axiosInstance.get<SupervisorGroupDto[]>(
      "/supervisor/questions/groups/me",
    );
    return res.data;
  },

  getQuestions: async (params?: {
    status?: string;
    topicId?: string;
    search?: string;
  }): Promise<QuestionListDto[]> => {
    const res = await axiosInstance.get<QuestionListDto[]>(
      "/supervisor/questions",
      { params },
    );
    return res.data;
  },

  getQuestionDetail: async (id: string): Promise<QuestionDetailDto> => {
    const res = await axiosInstance.get<QuestionDetailDto>(
      `/supervisor/questions/${id}`,
    );
    return res.data;
  },

  approve: async (id: string): Promise<void> => {
    await axiosInstance.post(`/supervisor/questions/${id}/approve`);
  },

  reject: async (id: string, rejectReason: string): Promise<void> => {
    await axiosInstance.post(`/supervisor/questions/${id}/reject`, {
      rejectReason,
    });
  },
};
