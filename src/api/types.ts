export type Role = "Student" | "Supervisor" | "Reviewer" | "Admin";

export type QuestionStatus =
  | "Pending Approval"
  | "Approved"
  | "Rejected"
  | "Answered";

export interface User {
  userId: string;
  userCode: string;
  fullName: string;
  email: string;
  role: Role;
  createdAt?: string;
}

export interface Topic {
  topicId: string;
  topicName: string;
  description: string;
  reviewerId: string;
  createdAt?: string;
}

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
