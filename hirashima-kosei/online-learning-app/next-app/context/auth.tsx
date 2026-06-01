"use client";

import { UserItem } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";
import { nextAxiosClient } from "@/lib/api/api-client";

interface AuthContextType {
  userState: UserItem | null;
  login: (loginUser: UserItem) => void;
  logout: () => Promise<void>;
  error: boolean;
  setError: (error: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  userState: null,
  login: () => {},
  logout: async () => {},
  error: false,
  setError: () => {},
});

export const AuthProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: UserItem | null;
}) => {
  const [userState, setUserState] = useState<UserItem | null>(initialUser);
  const [error, setError] = useState<boolean>(false);

  const login = (loginUser: UserItem) => {
    setUserState({
      userId: loginUser.userId,
      userName: loginUser.userName,
      userIcon: "/img/userIcon.png",
    });
  };

  const logout = async () => {
    try {
      await nextAxiosClient.post("/nextAuth/logout");
      setUserState(null);
    } catch (err) {
      setError(true);
    }
  };

  const value = { userState, login, logout, error, setError };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
