import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { studentService } from "../../api/studentService";
import { extractApiError } from "../../utils/helpers";
import Button from "../../components/Button";
import Card from "../../components/Card";

export default function CreateQuestionPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      setLoading(true);
      setError("");
      await studentService.createQuestion({
        title: title.trim(),
        content: content.trim(),
      });
      setSubmitted(true);
      setTimeout(() => navigate("/student"), 1500);
    } catch (err) {
      setError(extractApiError(err, "Failed to create question"));
    } finally {
      setLoading(false);
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
          {error && (
            <div className="mb-5 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
              {error}
            </div>
          )}

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
              disabled={!title.trim() || !content.trim() || loading}
            >
              {loading ? "Submitting..." : "Submit Question"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/student")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
