import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { formatDate } from "../../utils/helpers";
import {
  getStudentQuestionDetail,
  updateQuestion,
} from "../../api/studentService";
import type { QuestionDetailDto } from "../../api/types";

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [question, setQuestion] = useState<QuestionDetailDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id) {
      loadQuestionDetail();
    }
  }, [id]);

  const loadQuestionDetail = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getStudentQuestionDetail(id);
      setQuestion(data);
      setEditTitle(data.title);
      setEditContent(data.content);
    } catch (err: any) {
      console.error("Failed to load question:", err);
      setError(err.response?.data?.message || "Failed to load question");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-orange-600"></div>
        <p className="text-slate-500 text-sm">Loading question...</p>
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
      await updateQuestion(id, {
        title: editTitle,
        content: editContent
      });
      setSaved(true);
      setIsEditing(false);

      // Reload question to get updated data
      await loadQuestionDetail();

      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error("Failed to update question:", err);
      alert(err.response?.data?.message || "Failed to update question");
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
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-xl font-bold text-slate-800 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400"
                placeholder="Question title"
              />
            ) : (
              <h1 className="text-xl font-bold text-slate-800">
                {saved ? editTitle : question.title}
              </h1>
            )}
            <p className="text-xs text-slate-400 mt-1 font-mono">
              ID: {question.questionId}
            </p>
          </div>
          <div className="ml-4">
            <StatusBadge status={question.status} />
          </div>
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
              {formatDate(question.createdAt)}
            </p>
          </div>
        </div>

        {/* Question Content */}
        <div className="px-8 py-6">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Question
          </p>
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 resize-none"
            />
          ) : (
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-700 leading-relaxed">
              {saved ? editContent : question.content}
            </div>
          )}
        </div>

        {/* Rejection / Answer — comment-style blocks */}
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
              {formatDate(question.answer.answeredAt)}
            </p>
          </div>
        )}

        {/* Timeline */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100">
          <div className="flex flex-wrap gap-6 text-xs">
            <div>
              <span className="text-slate-400">Created:</span>{" "}
              <span className="text-slate-600 font-medium">
                {formatDate(question.createdAt)}
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
            {question.answer && (
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
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save & Re-submit"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditTitle(question.title);
                  setEditContent(question.content);
                }}
                disabled={saving}
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
