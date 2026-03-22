import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../pages/auth/LoginPage";

import StudentDashboard from "../pages/student/StudentDashboard";
import CreateQuestionPage from "../pages/student/CreateQuestionPage";
import QuestionDetailPage from "../pages/student/QuestionDetailPage";

import SupervisorDashboard from "../pages/supervisor/SupervisorDashboard";

import ReviewerDashboard from "../pages/reviewer/ReviewerDashboard";

import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import GroupManagement from "../pages/admin/GroupManagement";
import TopicManagement from "../pages/admin/TopicManagement";
import HistoryLogs from "../pages/admin/HistoryLogs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    element: <AuthLayout />,
    children: [{ path: "/login", element: <LoginPage /> }],
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      // Student routes
      {
        path: "/student",
        element: (
          <ProtectedRoute allowedRoles={["Student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/student/create",
        element: (
          <ProtectedRoute allowedRoles={["Student"]}>
            <CreateQuestionPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/student/question/:id",
        element: (
          <ProtectedRoute allowedRoles={["Student"]}>
            <QuestionDetailPage />
          </ProtectedRoute>
        ),
      },

      // Supervisor routes
      {
        path: "/supervisor",
        element: (
          <ProtectedRoute allowedRoles={["Supervisor"]}>
            <SupervisorDashboard />
          </ProtectedRoute>
        ),
      },

      // Reviewer routes
      {
        path: "/reviewer",
        element: (
          <ProtectedRoute allowedRoles={["Reviewer"]}>
            <ReviewerDashboard />
          </ProtectedRoute>
        ),
      },

      // Admin routes
      {
        path: "/admin",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/users",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/groups",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <GroupManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/topics",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <TopicManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "/admin/history",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <HistoryLogs />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <LoginPage />,
  },
]);

export default router;
