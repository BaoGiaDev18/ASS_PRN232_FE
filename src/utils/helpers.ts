import axios from "axios";

/**
 * Extract a human-readable error message from ASP.NET Core API responses.
 * Handles: { errors: { Field: ["msg"] } }, { message: "msg" }, { title: "msg" }
 */
export const extractApiError = (
  err: unknown,
  fallback = "Operation failed",
): string => {
  if (axios.isAxiosError(err) && err.response?.data) {
    const data = err.response.data;

    // ASP.NET Core validation errors: { errors: { Field: ["..."] } }
    if (data.errors && typeof data.errors === "object") {
      const messages = Object.values(
        data.errors as Record<string, string[]>,
      ).flat();
      if (messages.length > 0) return messages.join("; ");
    }

    if (typeof data.message === "string") return data.message;
    if (
      typeof data.title === "string" &&
      data.title !== "One or more validation errors occurred."
    )
      return data.title;
    if (typeof data === "string") return data;
  }

  if (!axios.isAxiosError(err))
    return "Cannot connect to server. Please try again.";

  return fallback;
};

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
