import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { studentService } from "../../api/studentService";
import StatusBadge from "../../components/StatusBadge";
import StatCard from "../../components/StatCard";
import { formatDate, extractApiError } from "../../utils/helpers";
import type { QuestionStatus, QuestionListDto } from "../../api/types";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<QuestionStatus | "">("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");
  const [questions, setQuestions] = useState<QuestionListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce search keyword to avoid firing API on every keystroke (fixes Vietnamese IME)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(searchKeyword), 500);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      if (debouncedKeyword.trim()) params.keyword = debouncedKeyword.trim();
      const data = await studentService.getQuestions(params);
      setQuestions(data);
    } catch (err) {
      setError(extractApiError(err, "Failed to load questions"));
    } finally {
      setLoading(false);
    }
  }, [statusFilter, debouncedKeyword]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const counts = {
    total: questions.length,
    pending: questions.filter((q) => q.status === "Pending Approval").length,
    approved: questions.filter((q) => q.status === "Approved").length,
    answered: questions.filter((q) => q.status === "Answered").length,
  };

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
      <div className="mb-6 flex items-center gap-4 flex-wrap">
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
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="Search by title..."
          className="h-10 border border-slate-300 rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 bg-white w-64"
        />
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
          {error}
        </div>
      )}

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
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
                      <p className="text-slate-400 text-sm">Loading...</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {questions.map((q) => (
                    <tr
                      key={q.questionId}
                      onClick={() =>
                        navigate(`/student/question/${q.questionId}`)
                      }
                      className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 max-w-xs truncate font-medium text-slate-700">
                        {q.title}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {q.topicName}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {q.createdByName}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={q.status} />
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        {q.createdAt ? formatDate(q.createdAt) : "—"}
                      </td>
                    </tr>
                  ))}
                  {questions.length === 0 && (
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
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
