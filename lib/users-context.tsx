"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { MOCK_USERS, type User, type UserStatus } from "./users-data";

interface UsersContextValue {
  users: User[];
  setUserStatus: (id: string, status: UserStatus) => void;
  getUserById: (id: string) => User | undefined;
}

const UsersContext = createContext<UsersContextValue | null>(null);

export function UsersProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>(() => [...MOCK_USERS]);

  const setUserStatus = useCallback((id: string, status: UserStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status } : u))
    );
  }, []);

  const getUserById = useCallback(
    (id: string) => users.find((u) => u.id === id),
    [users]
  );

  return (
    <UsersContext.Provider value={{ users, setUserStatus, getUserById }}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  const ctx = useContext(UsersContext);
  if (!ctx) throw new Error("useUsers must be used within UsersProvider");
  return ctx;
}
