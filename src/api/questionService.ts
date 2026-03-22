import axiosInstance from "./axiosInstance";
import type { Question } from "./types";

// Example API service — replace these with real API calls later

export const getQuestionsForStudent = async (
  studentId: string,
): Promise<Question[]> => {
  const response = await axiosInstance.get<Question[]>(
    `/questions/student/${studentId}`,
  );
  return response.data;
};

export const getQuestionsForSupervisor = async (
  supervisorId: string,
): Promise<Question[]> => {
  const response = await axiosInstance.get<Question[]>(
    `/questions/supervisor/${supervisorId}`,
  );
  return response.data;
};

export const getQuestionsForReviewer = async (
  reviewerId: string,
): Promise<Question[]> => {
  const response = await axiosInstance.get<Question[]>(
    `/questions/reviewer/${reviewerId}`,
  );
  return response.data;
};

export const createQuestion = async (data: {
  content: string;
  groupId: string;
  topicId: string;
}): Promise<Question> => {
  const response = await axiosInstance.post<Question>("/questions", data);
  return response.data;
};

export const approveQuestion = async (
  questionId: string,
): Promise<Question> => {
  const response = await axiosInstance.put<Question>(
    `/questions/${questionId}/approve`,
  );
  return response.data;
};

export const rejectQuestion = async (
  questionId: string,
  reason: string,
): Promise<Question> => {
  const response = await axiosInstance.put<Question>(
    `/questions/${questionId}/reject`,
    { reason },
  );
  return response.data;
};

export const answerQuestion = async (
  questionId: string,
  answer: string,
): Promise<Question> => {
  const response = await axiosInstance.put<Question>(
    `/questions/${questionId}/answer`,
    { answer },
  );
  return response.data;
};

export const updateQuestion = async (
  questionId: string,
  content: string,
): Promise<Question> => {
  const response = await axiosInstance.put<Question>(
    `/questions/${questionId}`,
    { content },
  );
  return response.data;
};
