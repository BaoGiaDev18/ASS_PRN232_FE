import { useState, useEffect, useCallback } from "react";
import { groupService } from "../../api/groupService";
import { userService } from "../../api/userService";
import { topicService } from "../../api/topicService";
import type { GroupDto, GroupDetailDto, User, TopicDto } from "../../api/types";
import { extractApiError } from "../../utils/helpers";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

export default function GroupManagement() {
  const [groups, setGroups] = useState<GroupDto[]>([]);
  const [supervisors, setSupervisors] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [topicsList, setTopicsList] = useState<TopicDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<GroupDetailDto | null>(null);

  const [formName, setFormName] = useState("");
  const [formSupervisorId, setFormSupervisorId] = useState("");
  const [formTopicId, setFormTopicId] = useState("");
  const [formStudentIds, setFormStudentIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchGroups = useCallback(async () => {
    try {
      const data = await groupService.getAll();
      setGroups(data);
    } catch {
      setError("Failed to load groups");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDropdownData = useCallback(async () => {
    try {
      const [sups, studs, topics] = await Promise.all([
        userService.getAll("Supervisor"),
        userService.getAll("Student"),
        topicService.getAll(),
      ]);
      setSupervisors(sups);
      setStudents(studs);
      setTopicsList(topics);
    } catch {
      // dropdown data load failure is non-critical
    }
  }, []);

  useEffect(() => {
    fetchGroups();
    fetchDropdownData();
  }, [fetchGroups, fetchDropdownData]);

  const openCreate = () => {
    setEditingGroup(null);
    setFormName("");
    setFormSupervisorId(supervisors[0]?.userId ?? "");
    setFormStudentIds([]);
    setFormTopicId(topicsList[0]?.topicId ?? "");
    setError("");
    setModalOpen(true);
  };

  const openEdit = async (g: GroupDto) => {
    try {
      const detail = await groupService.getById(g.groupId);
      setEditingGroup(detail);
      setFormName(detail.groupName);
      setFormSupervisorId(detail.supervisorId);
      setFormStudentIds(detail.members.map((m) => m.studentId));
      setFormTopicId(detail.topicId);
      setError("");
      setModalOpen(true);
    } catch {
      alert("Failed to load group details");
    }
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    setSaving(true);
    setError("");
    try {
      if (editingGroup) {
        await groupService.update(editingGroup.groupId, {
          groupName: formName,
          supervisorId: formSupervisorId,
          topicId: formTopicId,
        });
        // Sync members: add new, remove old
        const currentIds = editingGroup.members.map((m) => m.studentId);
        const toAdd = formStudentIds.filter((id) => !currentIds.includes(id));
        const toRemove = currentIds.filter(
          (id) => !formStudentIds.includes(id),
        );
        await Promise.all([
          ...toAdd.map((id) =>
            groupService.addMember(editingGroup.groupId, id),
          ),
          ...toRemove.map((id) =>
            groupService.removeMember(editingGroup.groupId, id),
          ),
        ]);
      } else {
        const created = await groupService.create({
          groupName: formName,
          supervisorId: formSupervisorId,
          topicId: formTopicId,
        });
        // Add members to the newly created group
        await Promise.all(
          formStudentIds.map((id) =>
            groupService.addMember(created.groupId, id),
          ),
        );
      }
      setModalOpen(false);
      await fetchGroups();
    } catch (err: unknown) {
      setError(extractApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this group?")) return;
    try {
      await groupService.delete(id);
      await fetchGroups();
    } catch {
      alert("Failed to delete group");
    }
  };

  const toggleStudent = (studentId: string) => {
    setFormStudentIds((prev) =>
      prev.includes(studentId)
        ? prev.filter((s) => s !== studentId)
        : [...prev, studentId],
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

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
                    {g.supervisorName}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {g.memberCount} member{g.memberCount !== 1 ? "s" : ""}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-semibold rounded-full border border-orange-200">
                      {g.topicName}
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
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
              {error}
            </div>
          )}
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
              {topicsList.map((t) => (
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
            <Button onClick={handleSave} disabled={!formName.trim() || saving}>
              {saving
                ? "Saving..."
                : editingGroup
                  ? "Save Changes"
                  : "Create Group"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
