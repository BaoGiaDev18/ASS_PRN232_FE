import {
  mockQuestions,
  mockUsers,
  mockGroups,
  mockTopics,
} from "../../utils/mockData";
import StatCard from "../../components/StatCard";
import StatusBadge from "../../components/StatusBadge";

export default function AdminDashboard() {
  const getUserName = (id: string) =>
    mockUsers.find((u) => u.userId === id)?.fullName ?? id;
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          System overview and management
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Users" value={mockUsers.length} icon="👥" />
        <StatCard
          label="Total Groups"
          value={mockGroups.length}
          icon="📁"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Total Topics"
          value={mockTopics.length}
          icon="📝"
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          label="Total Questions"
          value={mockQuestions.length}
          icon="❓"
          color="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Questions by status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Pending Approval"
          value={
            mockQuestions.filter((q) => q.status === "Pending Approval").length
          }
          icon="⏳"
          color="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          label="Approved"
          value={mockQuestions.filter((q) => q.status === "Approved").length}
          icon="✅"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Rejected"
          value={mockQuestions.filter((q) => q.status === "Rejected").length}
          icon="❌"
          color="bg-rose-50 text-rose-600"
        />
        <StatCard
          label="Answered"
          value={mockQuestions.filter((q) => q.status === "Answered").length}
          icon="💬"
          color="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Recent Questions */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Recent Questions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockQuestions.slice(0, 5).map((q) => (
                <tr
                  key={q.questionId}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-3.5 max-w-xs truncate font-medium text-slate-700">
                    {q.title}
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">
                    {getUserName(q.createdBy)}
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusBadge status={q.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
