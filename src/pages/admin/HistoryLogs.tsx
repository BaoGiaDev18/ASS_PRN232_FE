import { mockHistoryLogs } from "../../utils/mockData";
import { formatDate } from "../../utils/helpers";

export default function HistoryLogs() {
  const actionColors: Record<string, string> = {
    Created: "bg-slate-50 text-slate-700 border border-slate-200",
    Approved: "bg-blue-50 text-blue-700 border border-blue-200",
    Rejected: "bg-rose-50 text-rose-700 border border-rose-200",
    Answered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">History Logs</h1>
        <p className="text-slate-500 text-sm mt-1">
          Audit trail of all question activities
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Action
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Performed By
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockHistoryLogs
                .sort(
                  (a, b) =>
                    new Date(b.timestamp).getTime() -
                    new Date(a.timestamp).getTime(),
                )
                .map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${actionColors[log.action] ?? "bg-slate-50 text-slate-700 border border-slate-200"}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate font-medium text-slate-700">
                      {log.questionTitle}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {log.performedBy}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {log.details ?? "—"}
                    </td>
                  </tr>
                ))}
              {mockHistoryLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
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
