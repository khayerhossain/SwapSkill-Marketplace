"use client";
import React from "react";
import { Trophy, Medal, MapPin, Flame, Star } from "lucide-react";

export default function LeaderBoard() {
  const categories = [
    {
      name: "Programming",
      players: [
        {
          name: "Khayer Hossain",
          points: 980,
          rank: 1,
          level: "Pro Coder",
          location: "Sylhet, Bangladesh",
          streak: 15,
          avatar: "https://i.ibb.co.com/tBBM4kH/profile1.jpg",
        },
        {
          name: "Maisha Rahman",
          points: 870,
          rank: 2,
          level: "Code Enthusiast",
          location: "Dhaka, Bangladesh",
          streak: 12,
          avatar: "https://i.ibb.co.com/72PGz8r/profile2.jpg",
        },
        {
          name: "Ayaan Khan",
          points: 760,
          rank: 3,
          level: "Junior Developer",
          location: "Chittagong, Bangladesh",
          streak: 9,
          avatar: "https://i.ibb.co.com/z8v4gxG/profile3.jpg",
        },
      ],
    },
    {
      name: "Design",
      players: [
        {
          name: "Samiya Noor",
          points: 940,
          rank: 1,
          level: "Creative Pro",
          location: "Khulna, Bangladesh",
          streak: 13,
          avatar: "https://i.ibb.co.com/jT1yMJW/profile4.jpg",
        },
        {
          name: "Rafiul Hasan",
          points: 850,
          rank: 2,
          level: "UI Expert",
          location: "Rajshahi, Bangladesh",
          streak: 11,
          avatar: "https://i.ibb.co.com/k6WkZnT/profile5.jpg",
        },
        {
          name: "Tisha Akter",
          points: 730,
          rank: 3,
          level: "Design Lover",
          location: "Barishal, Bangladesh",
          streak: 8,
          avatar: "https://i.ibb.co.com/Yh5JrVD/profile6.jpg",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d0f] text-gray-900 dark:text-white py-10 px-4 transition-colors duration-500">
      <h1 className="text-4xl font-extrabold text-center mb-10 tracking-wide text-gray-900 dark:text-white drop-shadow-lg">
        🏆 Global Quiz Leaderboard
      </h1>

      <div className="max-w-5xl mx-auto space-y-12">
        {categories.map((category) => (
          <div
            key={category.name}
            className="bg-gray-100 dark:bg-[#141414] rounded-2xl shadow-lg dark:shadow-[0_0_25px_rgba(255,255,255,0.05)] p-6 border border-gray-300 dark:border-gray-800 transition-all duration-500"
          >
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
              <Trophy className="text-yellow-400" />
              {category.name}
            </h2>

            <div className="space-y-4">
              {category.players.map((player) => (
                <div
                  key={player.name}
                  className="flex items-center justify-between bg-white dark:bg-[#1b1b1e] rounded-xl p-4 border border-gray-300 dark:border-gray-700 transition-colors duration-500"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xl font-bold ${
                        player.rank === 1
                          ? "text-yellow-500"
                          : player.rank === 2
                          ? "text-gray-500 dark:text-gray-300"
                          : "text-orange-500"
                      }`}
                    >
                      #{player.rank}
                    </span>

                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-12 h-12 rounded-full border-2 border-gray-400 dark:border-gray-600 object-cover"
                    />

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {player.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <MapPin size={14} />
                        {player.location}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <Star size={14} /> Level:{" "}
                        <span className="text-yellow-500 dark:text-yellow-400">
                          {player.level}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end text-right">
                    <div className="flex items-center gap-2">
                      {player.rank === 1 && (
                        <Medal className="text-yellow-400" />
                      )}
                      {player.rank === 2 && <Medal className="text-gray-400" />}
                      {player.rank === 3 && (
                        <Medal className="text-orange-400" />
                      )}
                      <span className="font-semibold text-yellow-500 dark:text-yellow-400 text-lg">
                        {player.points} pts
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <Flame size={14} className="text-orange-500" />{" "}
                      {player.streak} Day Streak
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-gray-600 dark:text-gray-500 mt-10 text-sm tracking-wide">
        Updated daily | Keep pushing your limits 🚀
      </p>
    </div>
  );
}
