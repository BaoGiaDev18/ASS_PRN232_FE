import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { mockQuestions, mockTopics, mockUsers } from "../../utils/mockData";
import StatusBadge from "../../components/StatusBadge";
import StatCard from "../../components/StatCard";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { formatDate } from "../../utils/helpers";
import type { Question } from "../../api/types";

export default function ReviewerDashboard() {
  const { user } = useAuth();

  const getUserName = (id: string) =>
    mockUsers.find((u) => u.userId === id)?.fullName ?? id;
  const getTopicName = (id: string) =>
    mockTopics.find((t) => t.topicId === id)?.topicName ?? id;

  // Topics assigned to this reviewer
  const assignedTopics = mockTopics.filter(
    (t) => t.reviewerId === (user?.userId ?? ""),
  );
  const topicIds = assignedTopics.map((t) => t.topicId);

  // Questions within assigned topics
  const questions = mockQuestions.filter((q) => topicIds.includes(q.topicId));
  const approvedQuestions = questions.filter((q) => q.status === "Approved");

  const [answerModal, setAnswerModal] = useState<Question | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [actionDone, setActionDone] = useState<string | null>(null);

  const handleSubmitAnswer = () => {
    if (!answerText.trim()) return;
    setActionDone(
      `Answer submitted successfully for "${answerModal?.title.substring(0, 40)}..."`,
    );
    setAnswerModal(null);
    setAnswerText("");
    setTimeout(() => setActionDone(null), 3000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">
          Reviewer Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Answer approved questions within your topics
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Questions" value={questions.length} icon="📋" />
        <StatCard
          label="Needs Answer"
          value={approvedQuestions.length}
          icon="✏️"
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Assigned Topics"
          value={assignedTopics.length}
          icon="📝"
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* Assigned Topics */}
      <div className="mb-6 flex flex-wrap gap-2">
        {assignedTopics.map((t) => (
          <span
            key={t.topicId}
            className="inline-flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full border border-orange-200"
          >
            {t.topicName}
          </span>
        ))}
      </div>

      {actionDone && (
        <div className="mb-4 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium flex items-center gap-2">
          <span>✓</span> {actionDone}
        </div>
      )}

      {/* Questions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">
            Questions in Your Topics
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Topic
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {questions.map((q) => (
                <tr
                  key={q.questionId}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 max-w-xs truncate font-medium text-slate-700">
                    {q.title}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {getTopicName(q.topicId)}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {getUserName(q.createdBy)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={q.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">
                    {formatDate(q.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    {q.status === "Approved" && (
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-colors"
                        onClick={() => setAnswerModal(q)}
                      >
                        ✎ Answer
                      </button>
                    )}
                    {q.status === "Answered" && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        Answered
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {questions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📭</span>
                      <p className="text-slate-400 font-medium">
                        No questions found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Answer Modal */}
      <Modal
        open={!!answerModal}
        onClose={() => {
          setAnswerModal(null);
          setAnswerText("");
        }}
        title="Provide Official Answer"
      >
        {answerModal && (
          <div>
            <div className="mb-5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Question
              </p>
              <div className="text-sm text-slate-700 bg-slate-50 rounded-xl p-4 border border-slate-100 leading-relaxed">
                <p className="font-medium mb-1">{answerModal.title}</p>
                {answerModal.content}
              </div>
            </div>
            <div className="mb-4 flex gap-4 text-xs text-slate-400">
              <span>
                Student:{" "}
                <span className="text-slate-600 font-medium">
                  {getUserName(answerModal.createdBy)}
                </span>
              </span>
              <span>
                Topic:{" "}
                <span className="text-slate-600 font-medium">
                  {getTopicName(answerModal.topicId)}
                </span>
              </span>
            </div>
            <div className="mb-5">
              <label
                htmlFor="answer-text"
                className="block text-sm font-medium text-slate-700 mb-1.5"
              >
                Your Answer <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="answer-text"
                rows={6}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Provide a detailed official answer..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 resize-none transition-colors"
              />
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => {
                  setAnswerModal(null);
                  setAnswerText("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitAnswer}
                disabled={!answerText.trim()}
              >
                Submit Answer
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
