import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
import Card from "../../components/Card";
import { createQuestion, getStudentQuestions } from "../../api/studentService";
import type { QuestionListDto } from "../../api/types";

export default function CreateQuestionPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [groupInfo, setGroupInfo] = useState<{
    groupName: string;
    topicName: string;
  } | null>(null);
  const [loadingGroup, setLoadingGroup] = useState(true);

  useEffect(() => {
    loadStudentGroupInfo();
  }, []);

  const loadStudentGroupInfo = async () => {
    try {
      setLoadingGroup(true);

      // Get student's questions to extract group and topic info
      // This is a workaround since BE doesn't have dedicated student group endpoint
      const questions = await getStudentQuestions({ page: 1, pageSize: 1 });

      if (questions.length > 0) {
        setGroupInfo({
          groupName: questions[0].groupName,
          topicName: questions[0].topicName,
        });
      } else {
        // Student has no questions yet, so we can't determine group
        // This means student might not be assigned to any group
        setGroupInfo(null);
      }
    } catch (err: any) {
      console.error("Failed to load group info:", err);

      // If student API returns 404 or student has no questions
      // We'll allow creating questions anyway - BE will handle group detection
      if (err.response?.status === 404 || err.response?.status === 400) {
        setGroupInfo({
          groupName: "Auto-assigned",
          topicName: "Auto-assigned",
        });
      }
    } finally {
      setLoadingGroup(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setSubmitting(true);

      // ✅ FIX: Use new API format - only title and content
      // Backend automatically detects student's group and topic
      const result = await createQuestion({
        title,
        content,
      });

      console.log("Question created:", result);
      setSubmitted(true);
      setTimeout(() => navigate("/student"), 1500);
    } catch (err: any) {
      console.error("Failed to create question:", err);

      let errorMessage = "Failed to create question";
      if (err.response?.status === 400) {
        errorMessage = err.response.data || "Student is not assigned to any group";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      alert(errorMessage);
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
              value={
                loadingGroup
                  ? "Loading..."
                  : groupInfo?.groupName ?? "Auto-assigned by system"
              }
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
              value={
                loadingGroup
                  ? "Loading..."
                  : groupInfo?.topicName ?? "Auto-assigned by system"
              }
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
              disabled={!title.trim() || !content.trim() || submitting}
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
