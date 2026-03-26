import { useState, useEffect } from "react";
import { historyService } from "../../api/historyService";
import type { HistoryItemDto, HistorySummaryDto } from "../../api/types";
import { formatDate } from "../../utils/helpers";
import StatCard from "../../components/StatCard";
import Modal from "../../components/Modal";

export default function HistoryLogs() {
  const [items, setItems] = useState<HistoryItemDto[]>([]);
  const [summary, setSummary] = useState<HistorySummaryDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailItem, setDetailItem] = useState<HistoryItemDto | null>(null);

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
                    <button
                      className="text-left hover:text-orange-600 hover:underline transition-colors cursor-pointer"
                      onClick={() => setDetailItem(item)}
                    >
                      {item.title}
                    </button>
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

      {/* Detail Modal */}
      <Modal
        open={detailItem !== null}
        onClose={() => setDetailItem(null)}
        title="Question Detail"
      >
        {detailItem && (
          <div className="space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {detailItem.title}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                ID: {detailItem.questionId}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </span>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${statusColors[detailItem.status] ?? "bg-slate-50 text-slate-700 border border-slate-200"}`}
                  >
                    {detailItem.status}
                  </span>
                </div>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Created By
                </span>
                <p className="mt-1 text-slate-700 font-medium">
                  {detailItem.createdByName}
                </p>
                <p className="text-xs text-slate-400">
                  {detailItem.createdByCode}
                </p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Group
                </span>
                <p className="mt-1 text-slate-700">{detailItem.groupName}</p>
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Topic
                </span>
                <p className="mt-1 text-slate-700">{detailItem.topicName}</p>
              </div>
            </div>

            {detailItem.rejectReason && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-white text-[10px]">
                    ✕
                  </span>
                  <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                    Rejection Reason
                  </span>
                </div>
                <p className="text-sm text-rose-800 leading-relaxed">
                  {detailItem.rejectReason}
                </p>
              </div>
            )}

            {/* Timeline */}
            <div className="bg-slate-50 rounded-xl p-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Timeline
              </span>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Created</span>
                  <span className="text-slate-700 font-medium">
                    {detailItem.createdAt
                      ? formatDate(detailItem.createdAt)
                      : "—"}
                  </span>
                </div>
                {detailItem.approvedByName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Approved by {detailItem.approvedByName}
                    </span>
                    <span className="text-slate-700 font-medium">
                      {detailItem.approvedAt
                        ? formatDate(detailItem.approvedAt)
                        : "—"}
                    </span>
                  </div>
                )}
                {detailItem.answeredByName && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Answered by {detailItem.answeredByName}
                    </span>
                    <span className="text-slate-700 font-medium">
                      {detailItem.answeredAt
                        ? formatDate(detailItem.answeredAt)
                        : "—"}
                    </span>
                  </div>
                )}
                {detailItem.processingMinutes != null && (
                  <div className="flex justify-between border-t border-slate-200 pt-2 mt-2">
                    <span className="text-slate-500">Processing Time</span>
                    <span className="text-slate-700 font-medium">
                      {detailItem.processingMinutes < 60
                        ? `${detailItem.processingMinutes} min`
                        : `${Math.floor(detailItem.processingMinutes / 60)}h ${detailItem.processingMinutes % 60}m`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
