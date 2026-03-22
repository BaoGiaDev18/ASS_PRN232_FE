import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  mockQuestions,
  mockUsers,
  mockTopics,
  mockGroupMembers,
} from "../../utils/mockData";
import StatusBadge from "../../components/StatusBadge";
import StatCard from "../../components/StatCard";
import { formatDate } from "../../utils/helpers";
import type { QuestionStatus } from "../../api/types";

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<QuestionStatus | "">("");

  // Find student's group via group_members
  const membership = mockGroupMembers.find((m) => m.studentId === user?.userId);
  const groupQuestions = mockQuestions.filter(
    (q) => q.groupId === membership?.groupId,
  );
  const filtered = statusFilter
    ? groupQuestions.filter((q) => q.status === statusFilter)
    : groupQuestions;

  const counts = {
    total: groupQuestions.length,
    pending: groupQuestions.filter((q) => q.status === "Pending Approval")
      .length,
    approved: groupQuestions.filter((q) => q.status === "Approved").length,
    answered: groupQuestions.filter((q) => q.status === "Answered").length,
  };

  const getUserName = (id: string) =>
    mockUsers.find((u) => u.userId === id)?.fullName ?? "Unknown";
  const getTopicName = (id: string) =>
    mockTopics.find((t) => t.topicId === id)?.topicName ?? "Unknown";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Student Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Questions from your group</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Questions" value={counts.total} icon="📋" />
        <StatCard
          label="Pending Approval"
          value={counts.pending}
          icon="⏳"
          color="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          label="Approved"
          value={counts.approved}
          icon="✅"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Answered"
          value={counts.answered}
          icon="💬"
          color="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-4">
        <label className="text-sm font-medium text-slate-600">
          Filter by status:
        </label>
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as QuestionStatus | "")
          }
          className="h-10 border border-slate-300 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-white"
        >
          <option value="">All</option>
          <option value="Pending Approval">Pending Approval</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Answered">Answered</option>
        </select>
      </div>

      {/* Questions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Topic
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((q) => (
                <tr
                  key={q.questionId}
                  onClick={() => navigate(`/student/question/${q.questionId}`)}
                  className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4 max-w-xs truncate font-medium text-slate-700">
                    {q.title}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {getTopicName(q.topicId)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {getUserName(q.createdBy)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {formatDate(q.createdAt)}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📭</span>
                      <p className="text-slate-400 font-medium">
                        No questions found
                      </p>
                      <p className="text-slate-300 text-xs">
                        Try adjusting your filter
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
