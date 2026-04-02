import { createContext, useContext, useMemo, useState } from "react";
import type { AuthUser, UserRole } from "../types";

type Provider = "firebase" | "auth0";

type LoginPayload = {
  name: string;
  email: string;
  role: UserRole;
  provider: Provider;
  assignedRegionIds: string[];
};

type AuthContextType = {
  user: AuthUser | null;
  login: (payload: LoginPayload) => void;
  logout: () => void;
};

const AUTH_STORAGE_KEY = "ny-ghg-auth-session";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readPersistedSession = (): AuthUser | null => {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readPersistedSession());

  const login = (payload: LoginPayload) => {
    const nextUser: AuthUser = {
      id: crypto.randomUUID(),
      name: payload.name || "Mock User",
      email: payload.email,
      role: payload.role,
      provider: payload.provider,
      assignedRegionIds: payload.assignedRegionIds,
    };
    setUser(nextUser);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
