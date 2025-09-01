"use client";

import {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { useLoading } from "./LoadingContext";

interface User {
  userId: number;
  name: string;
  email: string;
  role: number;
  avatar_url?: string; // オプションのプロパティß
}

interface AuthContextType {
  user: User | null;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { setIsLoading } = useLoading();

  // ★ ユーザー情報を取得するロジックを関数として定義
  const fetchUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/me");
      if (!response.ok) {
        setUser(null);
        return;
      }
      const data = await response.json();

      setUser(data[0]);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchUser();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchUser]);

  // ★ logout関数を定義
  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" }); // ログアウトAPIを呼び出す
      setUser(null); // クライアント側のユーザー状態をクリア
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const value = useMemo(() => ({ user, logout, fetchUser }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
