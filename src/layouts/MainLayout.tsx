import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../api/types";
import NotificationBell from "../components/NotificationBell";

const navItems: Record<Role, { label: string; icon: string; path: string }[]> =
  {
    Student: [
      { label: "Dashboard", icon: "📊", path: "/student" },
      { label: "New Question", icon: "➕", path: "/student/create" },
    ],
    Supervisor: [{ label: "Dashboard", icon: "📊", path: "/supervisor" }],
    Reviewer: [{ label: "Dashboard", icon: "📊", path: "/reviewer" }],
    Admin: [
      { label: "Dashboard", icon: "📊", path: "/admin" },
      { label: "Users", icon: "👥", path: "/admin/users" },
      { label: "Groups", icon: "📁", path: "/admin/groups" },
      { label: "Topics", icon: "📝", path: "/admin/topics" },
      { label: "History", icon: "📜", path: "/admin/history" },
    ],
  };

const roleLabels: Record<Role, string> = {
  Student: "Student",
  Supervisor: "Supervisor",
  Reviewer: "Reviewer",
  Admin: "Admin",
};

const roleBadgeColors: Record<Role, string> = {
  Student: "bg-blue-50 text-blue-700 border-blue-200",
  Supervisor: "bg-purple-50 text-purple-700 border-purple-200",
  Reviewer: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Admin: "bg-orange-50 text-orange-700 border-orange-200",
};

function getBreadcrumb(pathname: string, role: Role): string[] {
  const crumbs: string[] = [roleLabels[role]];
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 1) {
    const pageMap: Record<string, string> = {
      create: "New Question",
      question: "Question Detail",
      users: "User Management",
      groups: "Group Management",
      topics: "Topic Management",
      history: "History Logs",
    };
    const page = segments[1];
    if (pageMap[page]) crumbs.push(pageMap[page]);
    else crumbs.push("Dashboard");
  } else {
    crumbs.push("Dashboard");
  }
  return crumbs;
}

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const items = navItems[user.role];
  const breadcrumbs = getBreadcrumb(location.pathname, user.role);
  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-white border-r border-slate-200/80 transform transition-transform duration-200 lg:translate-x-0 lg:static lg:inset-auto flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-100">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md shadow-orange-200">
            Q
          </div>
          <span className="font-bold text-slate-800 text-lg tracking-tight">
            SWP Q&A
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-orange-100 text-orange-700 font-bold border-r-4 border-orange-500 shadow-sm"
                    : "text-slate-600 hover:bg-orange-50 hover:text-orange-600 font-medium"
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            {/* Breadcrumb */}
            <nav className="hidden sm:flex items-center gap-1.5 text-sm">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-slate-300">/</span>}
                  <span
                    className={
                      i === breadcrumbs.length - 1
                        ? "text-slate-800 font-semibold"
                        : "text-slate-400"
                    }
                  >
                    {crumb}
                  </span>
                </span>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell — Student only */}
            {user.role === "Student" && <NotificationBell />}

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-700 leading-tight">
                  {user.fullName}
                </p>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border mt-0.5 ${roleBadgeColors[user.role]}`}
                >
                  {roleLabels[user.role]}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {initials}
              </div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <button
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-rose-600 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
