interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  color?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  color = "bg-orange-50 text-orange-500",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-800 leading-tight">
          {value}
        </p>
        <p className="text-sm text-slate-500 mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}
