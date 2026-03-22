import { useState, useEffect, useCallback } from "react";
import { supervisorService } from "../../api/supervisorService";
import type { QuestionListDto, SupervisorGroupDto } from "../../api/types";
import StatusBadge from "../../components/StatusBadge";
import StatCard from "../../components/StatCard";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { formatDate } from "../../utils/helpers";

export default function SupervisorDashboard() {
  const [questions, setQuestions] = useState<QuestionListDto[]>([]);
  const [groups, setGroups] = useState<SupervisorGroupDto[]>([]);
  const [loading, setLoading] = useState(true);

  const pendingQuestions = questions.filter(
    (q) => q.status === "Pending Approval",
  );

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionDone, setActionDone] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [qData, gData] = await Promise.all([
        supervisorService.getQuestions(),
        supervisorService.getMyGroups(),
      ]);
      setQuestions(qData);
      setGroups(gData);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApprove = async (q: QuestionListDto) => {
    setActionLoading(true);
    try {
      await supervisorService.approve(q.questionId);
      setActionDone(
        `Question "${q.title.substring(0, 40)}..." has been approved.`,
      );
      await fetchData();
      setTimeout(() => setActionDone(null), 3000);
    } catch {
      alert("Failed to approve question");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim() || !rejectTargetId) return;
    setActionLoading(true);
    try {
      await supervisorService.reject(rejectTargetId, rejectReason);
      setActionDone(`Question has been rejected with reason provided.`);
      setRejectModalOpen(false);
      setRejectTargetId(null);
      setRejectReason("");
      await fetchData();
      setTimeout(() => setActionDone(null), 3000);
    } catch {
      alert("Failed to reject question");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

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
          value={groups.length}
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
                    {q.createdByName}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{q.groupName}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {q.createdAt ? formatDate(q.createdAt) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    {q.status === "Pending Approval" && (
                      <div className="flex gap-2">
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                          onClick={() => handleApprove(q)}
                          disabled={actionLoading}
                        >
                          ✓ Approve
                        </button>
                        <button
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                          onClick={() => {
                            setRejectTargetId(q.questionId);
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

      <Modal
        open={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setRejectReason("");
          setRejectTargetId(null);
        }}
        title="Reject Question"
      >
        <div>
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
                setRejectTargetId(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleRejectSubmit}
              disabled={!rejectReason.trim() || actionLoading}
            >
              {actionLoading ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
