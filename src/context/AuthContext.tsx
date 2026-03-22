import { createContext, useContext, useState, type ReactNode } from "react";
import type { Role, User } from "../api/types";
import { mockUsers, mockGroupMembers } from "../utils/mockData";

interface AuthContextType {
  user: (User & { groupId?: string }) | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_ROLE: Role = "Student";

const getUserByRole = (role: Role): User & { groupId?: string } => {
  const user = mockUsers.find((u) => u.role === role)!;
  const membership = mockGroupMembers.find((m) => m.studentId === user.userId);
  return { ...user, groupId: membership?.groupId };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<(User & { groupId?: string }) | null>(null);

  const login = (_email: string, _password: string): boolean => {
    const found = mockUsers.find((u) => u.email === _email);
    if (found) {
      const membership = mockGroupMembers.find(
        (m) => m.studentId === found.userId,
      );
      setUser({ ...found, groupId: membership?.groupId });
    } else {
      setUser(getUserByRole(DEFAULT_ROLE));
    }
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: Role) => {
    setUser(getUserByRole(role));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
