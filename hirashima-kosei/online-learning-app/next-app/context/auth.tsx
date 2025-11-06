"use client";

import { nextAxiosClient } from "@/lib/api/api-client";
import { UserItem } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";
import { toast } from "sonner";

interface AuthContextType {
  userState: UserItem | null;
  login: (loginUser: UserItem) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userState: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: UserItem | null;
}) => {
  const [userState, setUserState] = useState<UserItem | null>(initialUser);

  const login = (loginUser: UserItem) => {
    setUserState({
      userId: loginUser.userId,
      userName: loginUser.userName,
      userIcon: "/img/userIcon.png",
    });
  };

  const logout = async () => {
    setUserState(null);
  };

  const value = { userState, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
