interface StatusBadgeProps {
  status: string;
}

const colors: Record<string, string> = {
  "Pending Approval": "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Approved: "bg-blue-50 text-blue-700 border border-blue-200",
  Rejected: "bg-rose-50 text-rose-700 border border-rose-200",
  Answered: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${colors[status] ?? "bg-slate-100 text-slate-700 border border-slate-200"}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {status}
    </span>
  );
}
