"use client";

import React, { useState } from "react";
import { useUserStats } from "@/context/UserStatsContext";

export default function RightSide() {
  const { incrementFollowing, decrementFollowing } = useUserStats();
  const [followedUsers, setFollowedUsers] = useState([]);

  const suggested = [
    { id: "najid", name: "Najid" },
    { id: "sheila", name: "Sheila Dara" },
    { id: "jhonson", name: "Jhonson" },
  ];

  const toggleFollow = (user) => {
    const isFollowing = followedUsers.includes(user.id);
    if (isFollowing) {
      setFollowedUsers((prev) => prev.filter((id) => id !== user.id));
      decrementFollowing();
    } else {
      setFollowedUsers((prev) => [...prev, user.id]);
      incrementFollowing();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/50 backdrop-blur-md rounded-xl border border-gray-700 p-4">
        <h3 className="font-semibold mb-3 text-white">Activity</h3>
        <ul className="space-y-2 text-gray-300 text-sm">
          <li className="hover:text-indigo-400 transition cursor-pointer">Deraa started following you</li>
          <li className="hover:text-indigo-400 transition cursor-pointer">Ediwp liked your photo</li>
          <li className="hover:text-indigo-400 transition cursor-pointer">Praha_ liked your photo</li>
        </ul>
      </div>

      <div className="bg-black/50 backdrop-blur-md rounded-xl border border-gray-700 p-4">
        <h3 className="font-semibold mb-3 text-white">Suggested For You</h3>
        <ul className="space-y-3 text-sm">
          {suggested.map((user) => {
            const isFollowing = followedUsers.includes(user.id);
            return (
              <li key={user.id} className="flex justify-between items-center text-gray-300 hover:text-white transition">
                <span>{user.name}</span>
                <button
                  onClick={() => toggleFollow(user)}
                  className={`px-3 py-1 rounded-lg transition ${
                    isFollowing ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
