import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("student1@swp.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    const success = login(email, password);
    if (success) {
      if (email.includes("admin")) navigate("/admin");
      else if (email.includes("supervisor")) navigate("/supervisor");
      else if (email.includes("reviewer")) navigate("/reviewer");
      else navigate("/student");
    } else {
      setError("Invalid credentials");
    }
  };

  const quickLogin = (_role: string, roleEmail: string) => {
    setEmail(roleEmail);
    setPassword("123456");
  };

  return (
    <div className="relative flex-1 flex items-center justify-center px-8 sm:px-12 lg:px-16 xl:px-24 py-8">
      {/* Logo - Absolute positioned at top */}
      <div className="absolute top-8 left-8 sm:left-12 lg:left-16 xl:left-24 flex items-center gap-2.5">
        <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white text-sm font-bold">QA</span>
        </div>
        <span className="text-lg font-bold text-slate-800">
          Welcome to QA-Sync
        </span>
      </div>

      {/* Form - Centered vertically and horizontally */}
      <div className="max-w-[420px] w-full">
        <p className="text-orange-500 text-sm font-medium mb-2">
          Bridge the Gap Between Students and Experts
        </p>
        <h1 className="text-2xl font-bold text-slate-800">
          Sign In to QA-Sync Tools
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-slate-600 mb-2">
              E-mail
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full h-12 px-4 pr-12 border-2 border-orange-400 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-orange-500 transition-colors"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
              </span>
            </div>
          </div>

          {/* Password Field */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 px-4 pr-12 border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/20 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 mt-4 bg-rose-50 border border-rose-200 rounded-lg">
              <span className="text-rose-500 text-sm">⚠</span>
              <p className="text-rose-700 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-12 mt-5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-sm"
          >
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400">Quick Login (Demo)</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Quick Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Student", email: "student1@swp.com", icon: "🎓" },
            {
              label: "Supervisor",
              email: "supervisor1@swp.com",
              icon: "👨‍🏫",
            },
            { label: "Reviewer", email: "reviewer1@swp.com", icon: "📝" },
            { label: "Admin", email: "admin@swp.com", icon: "⚙️" },
          ].map((item) => (
            <button
              key={item.email}
              type="button"
              onClick={() => quickLogin(item.label, item.email)}
              className="flex items-center justify-center gap-2 h-11 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
