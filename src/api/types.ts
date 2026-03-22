export type Role = "Student" | "Supervisor" | "Reviewer" | "Admin";

export type QuestionStatus =
  | "Pending Approval"
  | "Approved"
  | "Rejected"
  | "Answered";

// ─── Auth DTOs ──────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresAtUtc: string;
  user: UserDto;
}

export interface UserDto {
  userId: string;
  fullName: string;
  email: string;
  role: Role;
  userCode: string;
}

// ─── User Management DTOs ───────────────────────────────
export interface User {
  userId: string;
  userCode: string;
  fullName: string;
  email: string;
  role: Role;
  createdAt?: string | null;
}

export interface CreateUserRequest {
  userCode: string;
  fullName: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  role?: Role;
  password?: string;
}

// ─── Topic DTOs ─────────────────────────────────────────
export interface TopicDto {
  topicId: string;
  topicName: string;
  description: string | null;
  reviewerId: string;
  reviewerName: string;
  reviewerEmail: string;
  createdAt: string | null;
}

export interface TopicRequest {
  topicName: string;
  description?: string;
  reviewerId: string;
}

// Keep old Topic interface for backward compat
export interface Topic {
  topicId: string;
  topicName: string;
  description: string;
  reviewerId: string;
  createdAt?: string;
}

// ─── Group DTOs ─────────────────────────────────────────
export interface GroupDto {
  groupId: string;
  groupName: string;
  topicId: string;
  topicName: string;
  supervisorId: string;
  supervisorName: string;
  memberCount: number;
  createdAt: string | null;
}

export interface GroupDetailDto {
  groupId: string;
  groupName: string;
  topicId: string;
  topicName: string;
  supervisorId: string;
  supervisorName: string;
  createdAt: string | null;
  members: StudentDto[];
}

export interface StudentDto {
  studentId: string;
  userCode: string;
  fullName: string;
  email: string;
}

export interface GroupRequest {
  groupName: string;
  topicId: string;
  supervisorId: string;
}

export interface AddMemberRequest {
  studentId: string;
}

// Keep old Group interface for backward compat
export interface Group {
  groupId: string;
  groupName: string;
  topicId: string;
  supervisorId: string;
  createdAt?: string;
}

export interface GroupMember {
  groupId: string;
  studentId: string;
}

// ─── Question DTOs ──────────────────────────────────────
export interface QuestionListDto {
  questionId: string;
  title: string;
  status: QuestionStatus;
  groupName: string;
  topicName: string;
  createdByName: string;
  createdAt: string | null;
}

export interface QuestionDetailDto {
  questionId: string;
  title: string;
  content: string;
  status: QuestionStatus;
  rejectReason: string | null;
  createdById: string;
  createdByName: string;
  groupId: string;
  groupName: string;
  topicId: string;
  topicName: string;
  approvedBy: string | null;
  approvedByName: string | null;
  approvedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  answer: AnswerInfoDto | null;
}

export interface AnswerInfoDto {
  answerId: string;
  answerContent: string;
  reviewerId: string;
  reviewerName: string;
  answeredAt: string | null;
}

export interface RejectQuestionRequest {
  rejectReason: string;
}

export interface AnswerQuestionRequest {
  answerContent: string;
}

// ─── Supervisor DTOs ────────────────────────────────────
export interface SupervisorGroupDto {
  groupId: string;
  groupName: string;
  topicId: string;
  topicName: string;
  memberCount: number;
}

// ─── History DTOs ───────────────────────────────────────
export interface HistoryResponseDto {
  data: HistoryItemDto[];
  summary: HistorySummaryDto;
}

export interface HistoryItemDto {
  questionId: string;
  title: string;
  status: string;
  rejectReason: string | null;
  groupName: string;
  topicName: string;
  createdByName: string;
  createdByCode: string;
  createdAt: string | null;
  approvedByName: string | null;
  approvedAt: string | null;
  answeredByName: string | null;
  answeredAt: string | null;
  processingMinutes: number | null;
}

export interface HistorySummaryDto {
  total: number;
  answered: number;
  approved: number;
  rejected: number;
  pending: number;
}

// ─── Legacy types (kept for pages not yet migrated) ─────
export interface Question {
  questionId: string;
  title: string;
  content: string;
  status: QuestionStatus;
  rejectReason?: string;
  createdBy: string;
  groupId: string;
  topicId: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Answer {
  answerId: string;
  questionId: string;
  reviewerId: string;
  answerContent: string;
  answeredAt: string;
}

export interface Notification {
  notificationId: string;
  userId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface HistoryLog {
  id: string;
  questionId: string;
  questionTitle: string;
  action: "Created" | "Approved" | "Rejected" | "Answered";
  performedBy: string;
  timestamp: string;
  details?: string;
}
