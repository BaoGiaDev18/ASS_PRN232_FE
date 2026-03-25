import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { studentService } from "../../api/studentService";
import { extractApiError } from "../../utils/helpers";
import type { QuestionDetailDto } from "../../api/types";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { formatDate } from "../../utils/helpers";

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [question, setQuestion] = useState<QuestionDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await studentService.getQuestionDetail(id);
        setQuestion(data);
        setEditTitle(data.title);
        setEditContent(data.content);
      } catch (err) {
        setError(extractApiError(err, "Failed to load question"));
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-5xl">🔍</span>
        <p className="text-slate-400 text-lg font-medium">
          {error || "Question not found"}
        </p>
        <Button
          variant="ghost"
          className="mt-2"
          onClick={() => navigate("/student")}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const canEdit = question.status === "Rejected";
  const isLocked = question.status === "Answered";

  const handleSave = async () => {
    if (!id || !editTitle.trim() || !editContent.trim()) return;
    try {
      setSaving(true);
      await studentService.updateQuestion(id, {
        title: editTitle.trim(),
        content: editContent.trim(),
      });
      setSaved(true);
      setIsEditing(false);
      // Refresh data
      const updated = await studentService.getQuestionDetail(id);
      setQuestion(updated);
      setEditTitle(updated.title);
      setEditContent(updated.content);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(extractApiError(err, "Failed to update question"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/student")}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-orange-600 mb-6 transition-colors font-medium"
      >
        <span>←</span> Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800">
              {question.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              ID: {question.questionId}
            </p>
          </div>
          <StatusBadge status={question.status} />
        </div>

        {/* Info Grid */}
        <div className="px-8 py-6 border-b border-slate-100 grid grid-cols-3 gap-6">
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Created By
            </p>
            <p className="text-sm text-slate-700 font-medium">
              {question.createdByName}
            </p>
            <p className="text-xs text-slate-400">{question.groupName}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Topic
            </p>
            <p className="text-sm text-slate-700 font-medium">
              {question.topicName}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Created
            </p>
            <p className="text-sm text-slate-700">
              {question.createdAt ? formatDate(question.createdAt) : "—"}
            </p>
          </div>
        </div>

        {/* Question Content */}
        <div className="px-8 py-6">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Question
          </p>
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full h-11 px-4 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                placeholder="Question title"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 resize-none"
              />
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed">
              {question.content}
            </div>
          )}
        </div>

        {/* Rejection Reason */}
        {question.rejectReason && (
          <div className="mx-8 mb-6 bg-rose-50 border border-rose-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center text-white text-xs">
                ✕
              </span>
              <p className="text-xs font-bold text-rose-700 uppercase tracking-wider">
                Rejection Reason
              </p>
            </div>
            <p className="text-sm text-rose-800 leading-relaxed">
              {question.rejectReason}
            </p>
          </div>
        )}

        {/* Answer */}
        {question.answer && (
          <div className="mx-8 mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">
                ✓
              </span>
              <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Official Answer
              </p>
            </div>
            <p className="text-sm text-emerald-800 leading-relaxed">
              {question.answer.answerContent}
            </p>
            <p className="text-xs text-emerald-500 mt-3 font-medium">
              — {question.answer.reviewerName} •{" "}
              {question.answer.answeredAt
                ? formatDate(question.answer.answeredAt)
                : ""}
            </p>
          </div>
        )}

        {/* Timeline */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100">
          <div className="flex flex-wrap gap-6 text-xs">
            <div>
              <span className="text-slate-400">Created:</span>{" "}
              <span className="text-slate-600 font-medium">
                {question.createdAt ? formatDate(question.createdAt) : "—"}
              </span>
            </div>
            {question.approvedAt && (
              <div>
                <span className="text-slate-400">Approved:</span>{" "}
                <span className="text-slate-600 font-medium">
                  {formatDate(question.approvedAt)}
                </span>
              </div>
            )}
            {question.answer?.answeredAt && (
              <div>
                <span className="text-slate-400">Answered:</span>{" "}
                <span className="text-slate-600 font-medium">
                  {formatDate(question.answer.answeredAt)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-8 py-5 border-t border-slate-100 flex items-center gap-3">
          {canEdit && !isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit & Re-submit</Button>
          )}
          {isEditing && (
            <>
              <Button
                onClick={handleSave}
                disabled={saving || !editTitle.trim() || !editContent.trim()}
              >
                {saving ? "Saving..." : "Save & Re-submit"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(question.title);
                  setEditContent(question.content);
                }}
              >
                Cancel
              </Button>
            </>
          )}
          {isLocked && (
            <p className="text-sm text-slate-400 italic">
              This question has been answered and cannot be edited.
            </p>
          )}
          {saved && (
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-medium">
              ✓ Question re-submitted successfully!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
