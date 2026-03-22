import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  mockQuestions,
  mockUsers,
  mockGroups,
  mockTopics,
  mockAnswers,
} from "../../utils/mockData";
import StatusBadge from "../../components/StatusBadge";
import Button from "../../components/Button";
import { formatDate } from "../../utils/helpers";

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const question = mockQuestions.find((q) => q.questionId === id);
  const answer = mockAnswers.find((a) => a.questionId === id);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(question?.content ?? "");
  const [saved, setSaved] = useState(false);

  if (!question) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="text-5xl">🔍</span>
        <p className="text-slate-400 text-lg font-medium">Question not found</p>
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

  const getUserName = (uid: string) =>
    mockUsers.find((u) => u.userId === uid)?.fullName ?? "Unknown";
  const getGroupName = (gid: string) =>
    mockGroups.find((g) => g.groupId === gid)?.groupName ?? "Unknown";
  const getTopicName = (tid: string) =>
    mockTopics.find((t) => t.topicId === tid)?.topicName ?? "Unknown";

  const handleSave = () => {
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 2000);
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
              {getUserName(question.createdBy)}
            </p>
            <p className="text-xs text-slate-400">
              {getGroupName(question.groupId)}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Topic
            </p>
            <p className="text-sm text-slate-700 font-medium">
              {getTopicName(question.topicId)}
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

        {answer && (
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
              {answer.answerContent}
            </p>
            <p className="text-xs text-emerald-500 mt-3 font-medium">
              — {getUserName(answer.reviewerId)} •{" "}
              {formatDate(answer.answeredAt)}
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
            {answer && (
              <div>
                <span className="text-slate-400">Answered:</span>{" "}
                <span className="text-slate-600 font-medium">
                  {formatDate(answer.answeredAt)}
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
              <Button onClick={handleSave}>Save & Re-submit</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
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
