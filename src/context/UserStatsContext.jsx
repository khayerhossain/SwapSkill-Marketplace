// src/context/UserStatsContext.jsx
"use client";

import React, { createContext, useContext, useState } from "react";

const UserStatsContext = createContext(null);

export function UserStatsProvider({ children }) {
  // initial value — use your real initial following count if available
  const [followingCount, setFollowingCount] = useState(590);

  const incrementFollowing = () => setFollowingCount((v) => v + 1);
  const decrementFollowing = () => setFollowingCount((v) => Math.max(0, v - 1));

  return (
    <UserStatsContext.Provider
      value={{ followingCount, incrementFollowing, decrementFollowing }}
    >
      {children}
    </UserStatsContext.Provider>
  );
}

// hook for consuming
export function useUserStats() {
  const ctx = useContext(UserStatsContext);
  if (!ctx) throw new Error("useUserStats must be used inside UserStatsProvider");
  return ctx;
}
