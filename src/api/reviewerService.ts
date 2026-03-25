import axiosInstance from "./axiosInstance";
import type {
  QuestionListDto,
  QuestionDetailDto,
  AnswerQuestionRequest,
} from "./types";

export const reviewerService = {
  getQuestions: async (params?: {
    status?: string;
    topic_id?: string;
    search?: string;
  }): Promise<QuestionListDto[]> => {
    const res = await axiosInstance.get<QuestionListDto[]>(
      "/reviewer/questions",
      { params },
    );
    return res.data;
  },

  getQuestionDetail: async (id: string): Promise<QuestionDetailDto> => {
    const res = await axiosInstance.get<QuestionDetailDto>(
      `/reviewer/questions/${id}`,
    );
    return res.data;
  },

  answer: async (
    id: string,
    data: AnswerQuestionRequest,
  ): Promise<QuestionDetailDto> => {
    const res = await axiosInstance.post<QuestionDetailDto>(
      `/reviewer/questions/${id}/answer`,
      data,
    );
    return res.data;
  },
};
