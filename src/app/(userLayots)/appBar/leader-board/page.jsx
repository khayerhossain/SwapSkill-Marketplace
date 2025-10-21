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
    <div className="min-h-screen   text-gray-900 dark:text-white py-12 px-4 transition-colors duration-500">
      {/*  Header */}
      <h1 className="text-4xl font-extrabold text-center mb-14 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm tracking-wide">
         Global Skill Leaderboard
      </h1>

      <div className="max-w-5xl mx-auto space-y-12">
        {categories.map((category) => (
          <div
            key={category.name}
            className="backdrop-blur-xl  border border-gray-200/40 dark:border-white/10 rounded-3xl p-6 shadow-sm "
          >
            {/* Category Title */}
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent">
              <Trophy className="text-yellow-400" />
              {category.name}
            </h2>

            {/* Players */}
            <div className="space-y-4">
              {category.players.map((player) => (
                <div
                  key={player.name}
                  className="flex items-center justify-between  backdrop-blur-md border border-gray-200/40 dark:border-gray-700 rounded-2xl p-4 transition-all duration-300"
                >
                  {/* Left */}
                  <div className="flex items-center gap-4">
                    <span
                      className={`text-xl font-bold ${
                        player.rank === 1
                          ? "text-yellow-500"
                          : player.rank === 2
                          ? "text-gray-400"
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
                      <h3 className="text-lg font-semibold  text-white">
                        {player.name}
                      </h3>
                      <p className="text-sm text-gray-500  flex items-center gap-1">
                        <MapPin size={14} />
                        {player.location}
                      </p>
                      <p className="text-sm text-gray-500  flex items-center gap-1">
                        <Star size={14} /> Level:{" "}
                        <span className="text-yellow-500  font-medium">
                          {player.level}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end text-right">
                    <div className="flex items-center gap-2">
                      {player.rank === 1 && (
                        <Medal className="text-yellow-400" />
                      )}
                      {player.rank === 2 && <Medal className="text-gray-400" />}
                      {player.rank === 3 && (
                        <Medal className="text-orange-400" />
                      )}
                      <span className="font-semibold text-lg text-yellow-500 dark:text-yellow-400">
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

      {/* Footer */}
      <p className="text-center text-gray-600  mt-12 text-sm tracking-wide">
        Updated daily | Keep grinding for the top spot 
      </p>
    </div>
  );
}
