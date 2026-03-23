import axiosInstance from "./axiosInstance";
import type {
  QuestionListDto,
  QuestionDetailDto,
  AnswerQuestionRequest,
} from "./types";

/**
 * Reviewer API Service
 * Based on: /api/reviewer/questions endpoints
 * Reviewer chỉ thấy questions thuộc topic mà mình phụ trách
 */

/**
 * GET /api/reviewer/questions - Lấy danh sách questions
 * Query params: status, topic_id, search
 */
export const getReviewerQuestions = async (params?: {
  status?: string;
  topic_id?: string;
  search?: string;
}): Promise<QuestionListDto[]> => {
  const response = await axiosInstance.get<QuestionListDto[]>(
    "/reviewer/questions",
    { params }
  );
  return response.data;
};

/**
 * GET /api/reviewer/questions/{id} - Lấy chi tiết question
 */
export const getReviewerQuestionDetail = async (
  questionId: string
): Promise<QuestionDetailDto> => {
  const response = await axiosInstance.get<QuestionDetailDto>(
    `/reviewer/questions/${questionId}`
  );
  return response.data;
};

/**
 * POST /api/reviewer/questions/{id}/answer - Trả lời câu hỏi
 * Body: { answerContent: string }
 */
export const answerQuestion = async (
  questionId: string,
  data: AnswerQuestionRequest
): Promise<QuestionDetailDto> => {
  const response = await axiosInstance.post<QuestionDetailDto>(
    `/reviewer/questions/${questionId}/answer`,
    data
  );
  return response.data;
};
