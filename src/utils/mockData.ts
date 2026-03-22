import type {
  User,
  Group,
  GroupMember,
  Topic,
  Question,
  Answer,
  Notification,
  HistoryLog,
} from "../api/types";

// ─── Users ──────────────────────────────────────────────
export const mockUsers: User[] = [
  {
    userId: "admin-001",
    userCode: "ADM001",
    fullName: "Nguyen Van Admin",
    email: "admin@swp.com",
    role: "Admin",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    userId: "reviewer-001",
    userCode: "REV001",
    fullName: "Tran Thi Reviewer 1",
    email: "reviewer1@swp.com",
    role: "Reviewer",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    userId: "reviewer-002",
    userCode: "REV002",
    fullName: "Le Van Reviewer 2",
    email: "reviewer2@swp.com",
    role: "Reviewer",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    userId: "supervisor-001",
    userCode: "SUP001",
    fullName: "Pham Van Supervisor 1",
    email: "supervisor1@swp.com",
    role: "Supervisor",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    userId: "supervisor-002",
    userCode: "SUP002",
    fullName: "Hoang Thi Supervisor 2",
    email: "supervisor2@swp.com",
    role: "Supervisor",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    userId: "student-001",
    userCode: "STU001",
    fullName: "Student One",
    email: "student1@swp.com",
    role: "Student",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    userId: "student-002",
    userCode: "STU002",
    fullName: "Student Two",
    email: "student2@swp.com",
    role: "Student",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    userId: "student-003",
    userCode: "STU003",
    fullName: "Student Three",
    email: "student3@swp.com",
    role: "Student",
    createdAt: "2026-01-01T00:00:00Z",
  },
  {
    userId: "student-004",
    userCode: "STU004",
    fullName: "Student Four",
    email: "student4@swp.com",
    role: "Student",
    createdAt: "2026-01-01T00:00:00Z",
  },
];

// ─── Topics ─────────────────────────────────────────────
export const mockTopics: Topic[] = [
  {
    topicId: "topic-001",
    topicName: "AI-based Learning Support",
    description: "Hỗ trợ học tập bằng AI trong môi trường đại học",
    reviewerId: "reviewer-001",
    createdAt: "2026-01-15T00:00:00Z",
  },
  {
    topicId: "topic-002",
    topicName: "Web-based Question Answering System",
    description: "Hệ thống hỏi đáp trực tuyến cho nhóm sinh viên làm đồ án",
    reviewerId: "reviewer-002",
    createdAt: "2026-01-15T00:00:00Z",
  },
];

// ─── Groups ─────────────────────────────────────────────
export const mockGroups: Group[] = [
  {
    groupId: "group-001",
    groupName: "Group Alpha",
    topicId: "topic-001",
    supervisorId: "supervisor-001",
    createdAt: "2026-02-01T00:00:00Z",
  },
  {
    groupId: "group-002",
    groupName: "Group Beta",
    topicId: "topic-002",
    supervisorId: "supervisor-002",
    createdAt: "2026-02-01T00:00:00Z",
  },
];

// ─── Group Members ──────────────────────────────────────
export const mockGroupMembers: GroupMember[] = [
  { groupId: "group-001", studentId: "student-001" },
  { groupId: "group-001", studentId: "student-002" },
  { groupId: "group-002", studentId: "student-003" },
  { groupId: "group-002", studentId: "student-004" },
];

// ─── Questions ──────────────────────────────────────────
export const mockQuestions: Question[] = [
  {
    questionId: "question-001",
    title: "How to integrate chatbot into LMS?",
    content:
      "Nhóm em muốn hỏi cách tích hợp chatbot AI vào hệ thống LMS để hỗ trợ sinh viên đặt câu hỏi tự động.",
    status: "Answered",
    createdBy: "student-001",
    groupId: "group-001",
    topicId: "topic-001",
    approvedBy: "supervisor-001",
    approvedAt: "2026-03-02T10:00:00Z",
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-03-03T14:00:00Z",
  },
  {
    questionId: "question-002",
    title: "How to design approval workflow?",
    content:
      "Trong hệ thống hỏi đáp, nhóm em muốn thiết kế luồng duyệt câu hỏi giữa Student, Supervisor và Reviewer như thế nào cho hợp lý?",
    status: "Approved",
    createdBy: "student-003",
    groupId: "group-002",
    topicId: "topic-002",
    approvedBy: "supervisor-002",
    approvedAt: "2026-03-06T11:00:00Z",
    createdAt: "2026-03-05T09:30:00Z",
    updatedAt: "2026-03-06T11:00:00Z",
  },
  {
    questionId: "question-003",
    title: "Can we skip supervisor approval?",
    content:
      "Nhóm em muốn bỏ qua bước duyệt của giảng viên hướng dẫn để Reviewer trả lời trực tiếp có được không?",
    status: "Rejected",
    rejectReason:
      "Không được bỏ qua bước duyệt của Supervisor theo quy trình hệ thống.",
    createdBy: "student-002",
    groupId: "group-001",
    topicId: "topic-001",
    approvedBy: "supervisor-001",
    approvedAt: "2026-03-09T09:00:00Z",
    createdAt: "2026-03-08T10:00:00Z",
    updatedAt: "2026-03-09T09:00:00Z",
  },
  {
    questionId: "question-004",
    title: "Best practices for training AI models on student data?",
    content:
      "Nhóm em muốn hỏi về các phương pháp tốt nhất để huấn luyện mô hình AI trên dữ liệu sinh viên, đảm bảo quyền riêng tư và hiệu quả.",
    status: "Pending Approval",
    createdBy: "student-001",
    groupId: "group-001",
    topicId: "topic-001",
    createdAt: "2026-03-10T08:30:00Z",
    updatedAt: "2026-03-10T08:30:00Z",
  },
  {
    questionId: "question-005",
    title: "How to handle concurrent users in Q&A system?",
    content:
      "Hệ thống hỏi đáp cần xử lý nhiều người dùng cùng lúc. Nhóm em muốn hỏi cách thiết kế để đảm bảo hiệu năng và tránh xung đột dữ liệu.",
    status: "Approved",
    createdBy: "student-001",
    groupId: "group-001",
    topicId: "topic-001",
    approvedBy: "supervisor-001",
    approvedAt: "2026-03-12T10:00:00Z",
    createdAt: "2026-03-11T09:00:00Z",
    updatedAt: "2026-03-12T10:00:00Z",
  },
  {
    questionId: "question-006",
    title: "How to implement role-based access control?",
    content:
      "Nhóm em cần triển khai phân quyền theo vai trò (Student, Supervisor, Reviewer, Admin). Xin hỏi cách thiết kế hợp lý nhất?",
    status: "Pending Approval",
    createdBy: "student-004",
    groupId: "group-002",
    topicId: "topic-002",
    createdAt: "2026-03-13T14:00:00Z",
    updatedAt: "2026-03-13T14:00:00Z",
  },
];

// ─── Answers ────────────────────────────────────────────
export const mockAnswers: Answer[] = [
  {
    answerId: "answer-001",
    questionId: "question-001",
    reviewerId: "reviewer-001",
    answerContent:
      "Bạn có thể tích hợp chatbot qua REST API hoặc nhúng widget vào LMS. Nên thiết kế thêm module quản lý ngữ cảnh câu hỏi và phân quyền người dùng.",
    answeredAt: "2026-03-03T14:00:00Z",
  },
];

// ─── Notifications ──────────────────────────────────────
export const mockNotifications: Notification[] = [
  {
    notificationId: "notif-001",
    userId: "student-001",
    message: "Câu hỏi của bạn đã được Reviewer trả lời.",
    isRead: false,
    createdAt: "2026-03-03T14:00:00Z",
  },
  {
    notificationId: "notif-002",
    userId: "student-003",
    message: "Câu hỏi của bạn đã được Supervisor phê duyệt.",
    isRead: false,
    createdAt: "2026-03-06T11:00:00Z",
  },
  {
    notificationId: "notif-003",
    userId: "student-002",
    message: "Câu hỏi của bạn đã bị từ chối.",
    isRead: true,
    createdAt: "2026-03-09T09:00:00Z",
  },
  {
    notificationId: "notif-004",
    userId: "reviewer-001",
    message: "Bạn có một câu hỏi mới cần trả lời.",
    isRead: false,
    createdAt: "2026-03-06T12:00:00Z",
  },
];

// ─── History Logs ───────────────────────────────────────
export const mockHistoryLogs: HistoryLog[] = [
  {
    id: "h1",
    questionId: "question-001",
    questionTitle: "How to integrate chatbot into LMS?",
    action: "Created",
    performedBy: "Student One",
    timestamp: "2026-03-01T08:00:00Z",
  },
  {
    id: "h2",
    questionId: "question-001",
    questionTitle: "How to integrate chatbot into LMS?",
    action: "Approved",
    performedBy: "Pham Van Supervisor 1",
    timestamp: "2026-03-02T10:00:00Z",
  },
  {
    id: "h3",
    questionId: "question-001",
    questionTitle: "How to integrate chatbot into LMS?",
    action: "Answered",
    performedBy: "Tran Thi Reviewer 1",
    timestamp: "2026-03-03T14:00:00Z",
    details: "Provided integration guidance via REST API.",
  },
  {
    id: "h4",
    questionId: "question-002",
    questionTitle: "How to design approval workflow?",
    action: "Created",
    performedBy: "Student Three",
    timestamp: "2026-03-05T09:30:00Z",
  },
  {
    id: "h5",
    questionId: "question-002",
    questionTitle: "How to design approval workflow?",
    action: "Approved",
    performedBy: "Hoang Thi Supervisor 2",
    timestamp: "2026-03-06T11:00:00Z",
  },
  {
    id: "h6",
    questionId: "question-003",
    questionTitle: "Can we skip supervisor approval?",
    action: "Created",
    performedBy: "Student Two",
    timestamp: "2026-03-08T10:00:00Z",
  },
  {
    id: "h7",
    questionId: "question-003",
    questionTitle: "Can we skip supervisor approval?",
    action: "Rejected",
    performedBy: "Pham Van Supervisor 1",
    timestamp: "2026-03-09T09:00:00Z",
    details: "Không được bỏ qua bước duyệt của Supervisor.",
  },
];
