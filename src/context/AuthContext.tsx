import { createContext, useContext, useState, type ReactNode } from "react";
import type { UserDto } from "../api/types";
import { authService } from "../api/authService";

interface AuthContextType {
  user: UserDto | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getStoredUser(): UserDto | null {
  const token = localStorage.getItem("accessToken");
  const stored = localStorage.getItem("user");
  if (token && stored) {
    try {
      return JSON.parse(stored);
    } catch {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    }
  }
  return null;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserDto | null>(getStoredUser);
  const loading = false;

  const login = async (email: string, password: string): Promise<void> => {
    const res = await authService.login({ email, password });
    localStorage.setItem("accessToken", res.accessToken);
    localStorage.setItem("user", JSON.stringify(res.user));
    setUser(res.user);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
