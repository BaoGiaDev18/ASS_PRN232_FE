import { useState } from "react";
import { mockUsers } from "../../utils/mockData";
import type { User, Role } from "../../api/types";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([...mockUsers]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<Role>("Student");

  const openCreate = () => {
    setEditingUser(null);
    setFormName("");
    setFormEmail("");
    setFormRole("Student");
    setModalOpen(true);
  };

  const openEdit = (u: User) => {
    setEditingUser(u);
    setFormName(u.fullName);
    setFormEmail(u.email);
    setFormRole(u.role);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!formName.trim() || !formEmail.trim()) return;
    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.userId === editingUser.userId
            ? { ...u, fullName: formName, email: formEmail, role: formRole }
            : u,
        ),
      );
    } else {
      const newUser: User = {
        userId: `u${Date.now()}`,
        userCode: `UC${Date.now()}`,
        fullName: formName,
        email: formEmail,
        role: formRole,
      };
      setUsers((prev) => [...prev, newUser]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.userId !== id));
  };

  const roleColors: Record<Role, string> = {
    Student: "bg-blue-50 text-blue-700 border border-blue-200",
    Supervisor: "bg-purple-50 text-purple-700 border border-purple-200",
    Reviewer: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    Admin: "bg-orange-50 text-orange-700 border border-orange-200",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage system users and their roles
          </p>
        </div>
        <Button onClick={openCreate}>+ Add User</Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr
                  key={u.userId}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {u.fullName}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${roleColors[u.role]}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
                        onClick={() => openEdit(u)}
                      >
                        ✎ Edit
                      </button>
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
                        onClick={() => handleDelete(u.userId)}
                      >
                        ✕ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">👤</span>
                      <p className="text-slate-400 font-medium">
                        No users found
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
        title={editingUser ? "Edit User" : "Add New User"}
      >
        <div className="space-y-5">
          <div>
            <label
              htmlFor="user-name"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Name
            </label>
            <input
              id="user-name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full h-11 px-4 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-colors"
              placeholder="Full name"
            />
          </div>
          <div>
            <label
              htmlFor="user-email"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Email
            </label>
            <input
              id="user-email"
              type="email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="w-full h-11 px-4 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-colors"
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="user-role"
              className="block text-sm font-medium text-slate-700 mb-1.5"
            >
              Role
            </label>
            <select
              id="user-role"
              value={formRole}
              onChange={(e) => setFormRole(e.target.value as Role)}
              className="w-full h-11 px-4 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 transition-colors"
            >
              <option value="Student">Student</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Reviewer">Reviewer</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-3">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!formName.trim() || !formEmail.trim()}
            >
              {editingUser ? "Save Changes" : "Create User"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
