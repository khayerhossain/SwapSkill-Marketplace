"use client";
import React, { useEffect, useState } from "react";
import { Trophy, Medal, Mail } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import Loading from "@/app/loading";


export default function LeaderBoard() {
  
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const [loading, setLoading] = useState(true);




  useEffect(() => {
  const fetchLeaderboard = async () => {
    try {
      const res = await axiosInstance.get("/leaderBoard");
      const data = res.data; // Array of all users

      // Group by category
      const grouped = data.reduce((acc, user) => {
        if (!acc[user.category]) acc[user.category] = [];
        acc[user.category].push(user);
        return acc;
      }, {});

      // Convert to array + Sort + Add Rank
      const formattedCategories = Object.keys(grouped).map((categoryName) => {
        const sortedPlayers = grouped[categoryName]
          .sort((a, b) => b.coinsEarned - a.coinsEarned) // Sort desc
          .map((player, index) => ({
            ...player,
            rank: index + 1, // Assign rank dynamically
          }));

        return {
          name: categoryName,
          players: sortedPlayers,
        };
      });

      setCategories(formattedCategories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    }
  };

  fetchLeaderboard();
}, []);




  const filteredCategories =
    selectedCategory === "All"
      ? categories
      : categories.filter((cat) => cat.name === selectedCategory);

  if (loading)
    return (
      <div className="min-h-screen">
        <Loading></Loading>
      </div>
    );

  return (
    <div className="min-h-screen text-gray-900 dark:text-white py-12 px-4 transition-colors duration-500">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm tracking-wide">
        Global Skill Leaderboard
      </h1>

      {/* Category Filter Dropdown */}
      <div className="flex justify-center mb-10 ">
        <select
          className="p-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-transparent  text-red-500  cursor-pointer"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option  key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        {filteredCategories.map((category) => (
          <div
            key={category.name}
            className="backdrop-blur-xl border border-gray-200/40 dark:border-white/10 rounded-2xl p-4 sm:p-6 md:p-6 shadow-sm"
          >
            {/* Category Title */}
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 bg-clip-text text-transparent justify-center">
          <Trophy className="text-yellow-400" />
          {category.name}
        </h2>

            {/* Players */}
            <div className="space-y-4">
              {category.players.map((player, index) => (
                <div
                  key={player.name + index}
                  className="flex flex-col md:flex-row md:items-center  sm:flex-row  sm:items-center justify-between gap-4 md:gap-6 sm:gap-6 backdrop-blur-md border border-gray-200/40 dark:border-gray-700 rounded-xl p-3 md:p-4 sm:p-4 transition-all duration-300 "
                >
                  {/* Left */}
                  <div className="flex items-center gap-3 sm:gap-4 md:gap-4">
                    <span
                      className={`text-lg sm:text-xl font-bold md:text-xl ${
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
                      src={player.userImg}
                      alt={player.userName}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-gray-400 dark:border-gray-600 object-cover md:w-12 md:h-12 "
                    />

                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white md:text-lg">
                        {player.userName}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1 md:text-sm">
                        <Mail size={14} />
                        {player.userEmail}
                      </p>

                      {/*<p className="text-sm text-gray-500 flex items-center gap-1">
                        <Star size={14} /> Level:{" "}
                        <span className="text-yellow-500 font-medium">
                          {player.level}
                        </span>
                      </p>*/}

                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end text-right">
                    <div className="flex items-center gap-1 sm:gap-2 md:gap-2">
                      {player.rank === 1 && <Medal className="text-yellow-400" />}
                      {player.rank === 2 && <Medal className="text-gray-400" />}
                      {player.rank === 3 && <Medal className="text-orange-400" />}
                      <span className="font-semibold text-sm sm:text-lg text-yellow-500 dark:text-yellow-400 md:text-lg">
                        {player.coinsEarned} pts
                      </span>
                    </div>

                    {/*<p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                      <Flame size={14} className="text-orange-500" />{" "}
                      {player.streak} Day Streak
                    </p>*/}

                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-center text-gray-600 mt-12 text-sm tracking-wide">
        Updated daily | Keep grinding for the top spot
      </p>
    </div>
  );
}

