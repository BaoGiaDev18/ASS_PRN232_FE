import { useState, useEffect } from "react";
import { userService } from "../../api/userService";
import { topicService } from "../../api/topicService";
import { groupService } from "../../api/groupService";
import { historyService } from "../../api/historyService";
import type { HistorySummaryDto } from "../../api/types";
import StatCard from "../../components/StatCard";

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [topicCount, setTopicCount] = useState(0);
  const [summary, setSummary] = useState<HistorySummaryDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [users, groups, topics, history] = await Promise.all([
          userService.getAll(),
          groupService.getAll(),
          topicService.getAll(),
          historyService.getAll(),
        ]);
        setUserCount(users.length);
        setGroupCount(groups.length);
        setTopicCount(topics.length);
        setSummary(history.summary);
      } catch {
        // silently fail — individual pages will show errors
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">
          System overview and management
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard label="Total Users" value={userCount} icon="👥" />
        <StatCard
          label="Total Groups"
          value={groupCount}
          icon="📁"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Total Topics"
          value={topicCount}
          icon="📝"
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          label="Total Questions"
          value={summary?.total ?? 0}
          icon="❓"
          color="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Questions by status */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Pending Approval"
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
    </div>
  );
}
