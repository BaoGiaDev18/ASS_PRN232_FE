import { useState } from "react";
import { mockTopics, mockUsers } from "../../utils/mockData";
import type { Topic } from "../../api/types";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

export default function TopicManagement() {
  const [topics, setTopics] = useState<Topic[]>([...mockTopics]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);

  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formReviewerId, setFormReviewerId] = useState("");

  const reviewers = mockUsers.filter((u) => u.role === "Reviewer");

  const openCreate = () => {
    setEditingTopic(null);
    setFormName("");
    setFormDesc("");
    setFormReviewerId(reviewers[0]?.userId ?? "");
    setModalOpen(true);
  };

  const openEdit = (t: Topic) => {
    setEditingTopic(t);
    setFormName(t.topicName);
    setFormDesc(t.description);
    setFormReviewerId(t.reviewerId);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editingTopic) {
      setTopics((prev) =>
        prev.map((t) =>
          t.topicId === editingTopic.topicId
            ? {
                ...t,
                topicName: formName,
                description: formDesc,
                reviewerId: formReviewerId,
              }
            : t,
        ),
      );
    } else {
      const newTopic: Topic = {
        topicId: `t${Date.now()}`,
        topicName: formName,
        description: formDesc,
        reviewerId: formReviewerId,
      };
      setTopics((prev) => [...prev, newTopic]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setTopics((prev) => prev.filter((t) => t.topicId !== id));
  };

  const getReviewerName = (id: string) =>
    mockUsers.find((u) => u.userId === id)?.fullName ?? "N/A";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Topic Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage topics and assign reviewers
          </p>
        </div>
        <Button onClick={openCreate}>+ Add Topic</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Topic Name
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Reviewer
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topics.map((t) => (
                <tr
                  key={t.topicId}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {t.topicName}
                  </td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                    {t.description}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {getReviewerName(t.reviewerId)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
                        onClick={() => openEdit(t)}
                      >
                        ✎ Edit
                      </button>
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                        onClick={() => handleDelete(t.topicId)}
                      >
                        ✕ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {topics.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📝</span>
                      <p className="text-slate-400 font-medium">
                        No topics found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTopic ? "Edit Topic" : "Add New Topic"}
      >
        <div className="space-y-5">
          <div>
            <label
              htmlFor="topic-name"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Topic Name
            </label>
            <input
              id="topic-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full h-11 px-4 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-colors"
              placeholder="e.g. Cloud Computing"
            />
          </div>
          <div>
            <label
              htmlFor="topic-desc"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Description
            </label>
            <textarea
              id="topic-desc"
              rows={4}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 resize-none transition-colors"
              placeholder="Brief description of the topic..."
            />
          </div>
          <div>
            <label
              htmlFor="topic-reviewer"
              className="text-sm font-medium text-slate-700 mb-2"
            >
              Assign Reviewer
            </label>
            <select
              id="topic-reviewer"
              value={formReviewerId}
              onChange={(e) => setFormReviewerId(e.target.value)}
              className="w-full h-11 px-4 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-colors"
            >
              <option value="">Select a reviewer</option>
              {reviewers.map((r) => (
                <option key={r.userId} value={r.userId}>
                  {r.fullName} ({r.email})
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formName.trim()}>
              {editingTopic ? "Save Changes" : "Create Topic"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
