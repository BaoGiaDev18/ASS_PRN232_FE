import axiosInstance from "./axiosInstance";
import type {
  QuestionListDto,
  QuestionDetailDto,
} from "./types";

/**
 * Student API Service
 * Note: Backend chưa có Student Controller trong API documentation
 * Các functions này được chuẩn bị sẵn cho khi BE implement
 *
 * Hiện tại students có thể:
 * 1. Xem questions trong group của mình
 * 2. Tạo question mới
 * 3. Xem chi tiết question (bao gồm answer từ reviewer)
 * 4. Chỉnh sửa question khi bị reject
 */

/**
 * Lấy danh sách questions của student (trong group)
 * Endpoint dự kiến: GET /api/student/questions (chưa có trong BE)
 * Tạm thời có thể dùng supervisor endpoint hoặc filter phía FE
 */
export const getStudentQuestions = async (params?: {
  status?: string;
  search?: string;
}): Promise<QuestionListDto[]> => {
  const response = await axiosInstance.get<QuestionListDto[]>(
    "/student/questions",
    { params }
  );
  return response.data;
};

/**
 * Lấy chi tiết question
 * Có thể dùng supervisor hoặc reviewer endpoint
 * GET /api/supervisor/questions/{id} hoặc /api/reviewer/questions/{id}
 */
export const getStudentQuestionDetail = async (
  questionId: string
): Promise<QuestionDetailDto> => {
  // Tạm thời dùng supervisor endpoint vì cả student, supervisor, reviewer
  // đều có thể xem chi tiết question
  const response = await axiosInstance.get<QuestionDetailDto>(
    `/supervisor/questions/${questionId}`
  );
  return response.data;
};

/**
 * Tạo question mới
 * Endpoint dự kiến: POST /api/student/questions
 */
export interface CreateQuestionRequest {
  title: string;
  content: string;
  groupId: string;
  topicId: string;
}

export const createQuestion = async (
  data: CreateQuestionRequest
): Promise<QuestionDetailDto> => {
  const response = await axiosInstance.post<QuestionDetailDto>(
    "/student/questions",
    data
  );
  return response.data;
};

/**
 * Cập nhật question (khi bị reject)
 * Endpoint dự kiến: PUT /api/student/questions/{id}
 */
export interface UpdateQuestionRequest {
  title?: string;
  content?: string;
}

export const updateQuestion = async (
  questionId: string,
  data: UpdateQuestionRequest
): Promise<QuestionDetailDto> => {
  const response = await axiosInstance.put<QuestionDetailDto>(
    `/student/questions/${questionId}`,
    data
  );
  return response.data;
};
