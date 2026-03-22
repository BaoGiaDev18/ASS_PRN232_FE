import { useState } from "react";
import {
  mockGroups,
  mockUsers,
  mockTopics,
  mockGroupMembers,
} from "../../utils/mockData";
import type { Group, GroupMember } from "../../api/types";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

export default function GroupManagement() {
  const [groups, setGroups] = useState<Group[]>([...mockGroups]);
  const [members, setMembers] = useState<GroupMember[]>([...mockGroupMembers]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const [formName, setFormName] = useState("");
  const [formSupervisorId, setFormSupervisorId] = useState("");
  const [formStudentIds, setFormStudentIds] = useState<string[]>([]);
  const [formTopicId, setFormTopicId] = useState("");

  const supervisors = mockUsers.filter((u) => u.role === "Supervisor");
  const students = mockUsers.filter((u) => u.role === "Student");

  const openCreate = () => {
    setEditingGroup(null);
    setFormName("");
    setFormSupervisorId(supervisors[0]?.userId ?? "");
    setFormStudentIds([]);
    setFormTopicId(mockTopics[0]?.topicId ?? "");
    setModalOpen(true);
  };

  const openEdit = (g: Group) => {
    setEditingGroup(g);
    setFormName(g.groupName);
    setFormSupervisorId(g.supervisorId);
    setFormStudentIds(
      members.filter((m) => m.groupId === g.groupId).map((m) => m.studentId),
    );
    setFormTopicId(g.topicId);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;
    if (editingGroup) {
      setGroups((prev) =>
        prev.map((g) =>
          g.groupId === editingGroup.groupId
            ? {
                ...g,
                groupName: formName,
                supervisorId: formSupervisorId,
                topicId: formTopicId,
              }
            : g,
        ),
      );
      // Update members for this group
      setMembers((prev) => [
        ...prev.filter((m) => m.groupId !== editingGroup.groupId),
        ...formStudentIds.map((sid) => ({
          groupId: editingGroup.groupId,
          studentId: sid,
        })),
      ]);
    } else {
      const newGroupId = `g${Date.now()}`;
      const newGroup: Group = {
        groupId: newGroupId,
        groupName: formName,
        supervisorId: formSupervisorId,
        topicId: formTopicId,
      };
      setGroups((prev) => [...prev, newGroup]);
      setMembers((prev) => [
        ...prev,
        ...formStudentIds.map((sid) => ({
          groupId: newGroupId,
          studentId: sid,
        })),
      ]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.groupId !== id));
    setMembers((prev) => prev.filter((m) => m.groupId !== id));
  };

  const toggleStudent = (studentId: string) => {
    setFormStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((s) => s !== studentId)
        : [...prev, studentId],
    );
  };

  const getSupervisorName = (id: string) =>
    mockUsers.find((u) => u.userId === id)?.fullName ?? "N/A";
  const getStudentNames = (groupId: string) =>
    members
      .filter((m) => m.groupId === groupId)
      .map(
        (m) =>
          mockUsers.find((u) => u.userId === m.studentId)?.fullName ??
          "Unknown",
      )
      .join(", ");
  const getTopicName = (id: string) =>
    mockTopics.find((t) => t.topicId === id)?.topicName ?? "N/A";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Group Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage groups, assign students and supervisors
          </p>
        </div>
        <Button onClick={openCreate}>+ Add Group</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Group Name
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Supervisor
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Students
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Topic
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groups.map((g) => (
                <tr
                  key={g.groupId}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {g.groupName}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {getSupervisorName(g.supervisorId)}
                  </td>
                  <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                    {getStudentNames(g.groupId)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full border border-orange-200">
                      {getTopicName(g.topicId)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
                        onClick={() => openEdit(g)}
                      >
                        ✎ Edit
                      </button>
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                        onClick={() => handleDelete(g.groupId)}
                      >
                        ✕ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {groups.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📁</span>
                      <p className="text-slate-400 font-medium">
                        No groups found
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
        title={editingGroup ? "Edit Group" : "Add New Group"}
      >
        <div className="space-y-5">
          <div>
            <label
              htmlFor="group-name"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Group Name
            </label>
            <input
              id="group-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full h-11 px-4 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-colors"
              placeholder="e.g. Group SE1803"
            />
          </div>
          <div>
            <label
              htmlFor="group-supervisor"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Supervisor
            </label>
            <select
              id="group-supervisor"
              value={formSupervisorId}
              onChange={(e) => setFormSupervisorId(e.target.value)}
              className="w-full h-11 px-4 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-colors"
            >
              {supervisors.map((s) => (
                <option key={s.userId} value={s.userId}>
                  {s.fullName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="group-topic"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Topic
            </label>
            <select
              id="group-topic"
              value={formTopicId}
              onChange={(e) => setFormTopicId(e.target.value)}
              className="w-full h-11 px-4 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-colors"
            >
              {mockTopics.map((t) => (
                <option key={t.topicId} value={t.topicId}>
                  {t.topicName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">
              Assign Students
            </p>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-4">
              {students.map((s) => (
                <label
                  key={s.userId}
                  className="flex items-center gap-2.5 text-sm cursor-pointer text-slate-600 hover:text-slate-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formStudentIds.includes(s.userId)}
                    onChange={() => toggleStudent(s.userId)}
                    className="rounded border-slate-300 text-orange-500 focus:ring-orange-500/20"
                  />
                  {s.fullName} ({s.email})
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formName.trim()}>
              {editingGroup ? "Save Changes" : "Create Group"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
