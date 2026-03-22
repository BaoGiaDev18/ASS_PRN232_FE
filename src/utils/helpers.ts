export const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const statusColor = (status: string): string => {
  switch (status) {
    case "Pending Approval":
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";
    case "Approved":
      return "bg-blue-50 text-blue-700 border border-blue-200";
    case "Rejected":
      return "bg-rose-50 text-rose-700 border border-rose-200";
    case "Answered":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 border border-slate-200";
  }
};
