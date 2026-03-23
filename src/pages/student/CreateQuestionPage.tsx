import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { createQuestion } from "../../api/studentService";
import { groupService } from "../../api/groupService";
import type { GroupDto } from "../../api/types";

export default function CreateQuestionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [group, setGroup] = useState<GroupDto | null>(null);
  const [loadingGroup, setLoadingGroup] = useState(true);

  useEffect(() => {
    loadStudentGroup();
  }, []);

  const loadStudentGroup = async () => {
    try {
      setLoadingGroup(true);
      // Fetch all groups and find the one where the current student is a member
      // Note: Backend might need an endpoint specifically for student's group
      const groups = await groupService.getAll();
      // For now, we'll assume student is in the first group
      // This should be replaced with proper group membership check
      if (groups.length > 0) {
        setGroup(groups[0]);
      }
    } catch (err: any) {
      console.error("Failed to load group:", err);
    } finally {
      setLoadingGroup(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !group) return;

    try {
      setSubmitting(true);
      await createQuestion({
        title,
        content,
        groupId: group.groupId,
        topicId: group.topicId,
      });
      setSubmitted(true);
      setTimeout(() => navigate("/student"), 1500);
    } catch (err: any) {
      console.error("Failed to create question:", err);
      alert(err.response?.data?.message || "Failed to create question");
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="text-center max-w-md p-10">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
            ✅
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            Question Submitted!
          </h2>
          <p className="text-slate-500 text-sm">
            Your question has been sent for supervisor approval.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Create New Question
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Submit a question for your capstone project
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Group
            </label>
            <input
              type="text"
              value={group?.groupName ?? "N/A"}
              readOnly
              className="w-full h-11 px-4 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500"
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Topic (auto-assigned)
            </label>
            <input
              type="text"
              value={loadingGroup ? "Loading..." : group?.topicName ?? "N/A"}
              readOnly
              className="w-full h-11 px-4 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-500"
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="question-title"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="question-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your question"
              className="w-full h-11 px-4 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-colors"
            />
          </div>

          <div className="mb-8">
            <label
              htmlFor="question-content"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Question Content <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="question-content"
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your question in detail..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-colors resize-none"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={!title.trim() || !content.trim() || submitting || !group}
            >
              {submitting ? "Submitting..." : "Submit Question"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/student")}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
