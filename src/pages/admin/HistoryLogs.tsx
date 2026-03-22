import { useState, useEffect } from "react";
import { historyService } from "../../api/historyService";
import type { HistoryItemDto, HistorySummaryDto } from "../../api/types";
import { formatDate } from "../../utils/helpers";
import StatCard from "../../components/StatCard";

export default function HistoryLogs() {
  const [items, setItems] = useState<HistoryItemDto[]>([]);
  const [summary, setSummary] = useState<HistorySummaryDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await historyService.getAll();
        setItems(res.data);
        setSummary(res.summary);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statusColors: Record<string, string> = {
    "Pending Approval": "bg-yellow-50 text-yellow-700 border border-yellow-200",
    Approved: "bg-blue-50 text-blue-700 border border-blue-200",
    Rejected: "bg-rose-50 text-rose-700 border border-rose-200",
    Answered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
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
        <h1 className="text-2xl font-bold text-slate-800">History Logs</h1>
        <p className="text-slate-500 text-sm mt-1">
          Audit trail of all question activities
        </p>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total" value={summary.total} icon="📋" />
          <StatCard
            label="Pending"
            value={summary.pending}
            icon="⏳"
            color="bg-yellow-50 text-yellow-600"
          />
          <StatCard
            label="Approved"
            value={summary.approved}
            icon="✅"
            color="bg-blue-50 text-blue-600"
          />
          <StatCard
            label="Rejected"
            value={summary.rejected}
            icon="❌"
            color="bg-rose-50 text-rose-600"
          />
          <StatCard
            label="Answered"
            value={summary.answered}
            icon="💬"
            color="bg-emerald-50 text-emerald-600"
          />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Group
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Topic
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr
                  key={item.questionId}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                    {item.createdAt ? formatDate(item.createdAt) : "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[item.status] ?? "bg-slate-50 text-slate-700 border border-slate-200"}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs truncate font-medium text-slate-700">
                    {item.title}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {item.createdByName}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.groupName}</td>
                  <td className="px-6 py-4 text-slate-500">{item.topicName}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📋</span>
                      <p className="text-slate-400 font-medium">
                        No history logs found
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
