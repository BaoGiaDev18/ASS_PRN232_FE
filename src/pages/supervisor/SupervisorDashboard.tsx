import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { mockQuestions, mockGroups, mockUsers } from "../../utils/mockData";
import StatusBadge from "../../components/StatusBadge";
import StatCard from "../../components/StatCard";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { formatDate } from "../../utils/helpers";
import type { Question } from "../../api/types";

export default function SupervisorDashboard() {
  const { user } = useAuth();

  // Groups assigned to this supervisor
  const supervisorGroups = mockGroups.filter(
    (g) => g.supervisorId === user?.userId,
  );
  const groupIds = supervisorGroups.map((g) => g.groupId);

  // Questions from supervisor's groups
  const questions = mockQuestions.filter((q) => groupIds.includes(q.groupId));
  const pendingQuestions = questions.filter(
    (q) => q.status === "Pending Approval",
  );

  const getUserName = (id: string) =>
    mockUsers.find((u) => u.userId === id)?.fullName ?? "Unknown";
  const getGroupName = (id: string) =>
    mockGroups.find((g) => g.groupId === id)?.groupName ?? "Unknown";

  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null,
  );
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionDone, setActionDone] = useState<string | null>(null);

  const handleApprove = (q: Question) => {
    setActionDone(
      `Question "${q.title.substring(0, 40)}..." has been approved.`,
    );
    setSelectedQuestion(null);
    setTimeout(() => setActionDone(null), 3000);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) return;
    setActionDone(`Question has been rejected with reason provided.`);
    setRejectModalOpen(false);
    setSelectedQuestion(null);
    setRejectReason("");
    setTimeout(() => setActionDone(null), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Supervisor Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Review and approve questions from your groups
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Questions" value={questions.length} icon="📋" />
        <StatCard
          label="Pending Approval"
          value={pendingQuestions.length}
          icon="⏳"
          color="bg-yellow-50 text-yellow-600"
        />
        <StatCard
          label="Groups Managed"
          value={supervisorGroups.length}
          icon="👥"
          color="bg-blue-50 text-blue-600"
        />
      </div>

      {actionDone && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium flex items-center gap-2">
          <span>✓</span> {actionDone}
        </div>
      )}

      {/* Questions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">All Questions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Group
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {questions.map((q) => (
                <tr
                  key={q.questionId}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 max-w-xs truncate font-medium text-slate-700">
                    {q.title}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {getUserName(q.createdBy)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {getGroupName(q.groupId)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {formatDate(q.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    {q.status === "Pending Approval" && (
                      <div className="flex gap-2">
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                          onClick={() => handleApprove(q)}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                          onClick={() => {
                            setSelectedQuestion(q);
                            setRejectModalOpen(true);
                          }}
                        >
                          ✕ Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {questions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📭</span>
                      <p className="text-slate-400 font-medium">
                        No questions found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        open={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setRejectReason("");
        }}
        title="Reject Question"
      >
        {selectedQuestion && (
          <div>
            <div className="mb-5 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 mb-1">
                {selectedQuestion.title}
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedQuestion.content}
              </p>
            </div>
            <div className="mb-5">
              <label
                htmlFor="reject-reason"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Rejection Reason <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="reject-reason"
                rows={4}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Provide a reason for rejection..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-400 resize-none transition-colors"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleRejectSubmit}
                disabled={!rejectReason.trim()}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
