import axiosInstance from "./axiosInstance";
import type {
  QuestionListDto,
  QuestionDetailDto,
  Notification,
} from "./types";

/**
 * Student API Service
 * ✅ Backend đã có đầy đủ Student Controller
 * Endpoints: /api/student/*
 */

// ─── QUESTION APIs ───────────────────────────────────────

/**
 * Lấy danh sách questions của student (trong group)
 * GET /api/student/questions
 */
export const getStudentQuestions = async (params?: {
  status?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}): Promise<QuestionListDto[]> => {
  const response = await axiosInstance.get<QuestionListDto[]>(
    "/student/questions",
    { params }
  );
  return response.data;
};

/**
 * Lấy chi tiết question của student
 * GET /api/student/questions/{id}
 */
export const getStudentQuestionDetail = async (
  questionId: string
): Promise<QuestionDetailDto> => {
  const response = await axiosInstance.get<QuestionDetailDto>(
    `/student/questions/${questionId}`
  );
  return response.data;
};

/**
 * Tạo question mới
 * POST /api/student/questions
 * Backend tự động assign vào group của student hiện tại
 */
export interface CreateQuestionRequest {
  title: string;
  content: string;
}

export const createQuestion = async (
  data: CreateQuestionRequest
): Promise<{ questionId: string }> => {
  const response = await axiosInstance.post<{ questionId: string }>(
    "/student/questions",
    data
  );
  return response.data;
};

/**
 * Cập nhật question bị reject
 * PUT /api/student/questions/{id}
 * Chỉ có thể edit question có status = "Rejected"
 */
export interface UpdateQuestionRequest {
  title: string;
  content: string;
}

export const updateQuestion = async (
  questionId: string,
  data: UpdateQuestionRequest
): Promise<void> => {
  await axiosInstance.put(
    `/student/questions/${questionId}`,
    data
  );
};

// ─── NOTIFICATION APIs ───────────────────────────────────

/**
 * Lấy danh sách notifications của student
 * GET /api/student/notifications
 */
export const getStudentNotifications = async (params?: {
  isRead?: boolean;
}): Promise<Notification[]> => {
  const response = await axiosInstance.get<Notification[]>(
    "/student/notifications",
    { params }
  );
  return response.data;
};

/**
 * Đánh dấu notification đã đọc
 * POST /api/student/notifications/{id}/read
 */
export const markNotificationAsRead = async (
  notificationId: string
): Promise<void> => {
  await axiosInstance.post(`/student/notifications/${notificationId}/read`);
};

// ─── EXPORT DEFAULT SERVICE OBJECT ──────────────────────

export const studentService = {
  // Questions
  getQuestions: getStudentQuestions,
  getQuestionDetail: getStudentQuestionDetail,
  createQuestion,
  updateQuestion,

  // Notifications
  getNotifications: getStudentNotifications,
  markNotificationAsRead,
};
