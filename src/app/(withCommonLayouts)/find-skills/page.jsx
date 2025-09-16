"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { MessageSquare, Eye } from "lucide-react"; 

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("newest");
  const limit = 6;

  useEffect(() => {
    const fetchSkills = async () => {
      const res = await fetch(
        `/api/find-skills?search=${search}&page=${page}&limit=${limit}&sort=${sort}`
      );
      const data = await res.json();
      setSkills(data.skills);
      setTotalPages(data.totalPages);
    };
    fetchSkills();
  }, [search, page, sort]);

  return (
    <div className="max-w-6xl mx-auto pt-24 px-4">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-8">
         Explore <span className="text-blue-600">Skills</span>
      </h1>

      {/* Search & Sort (Centered) */}
      <div className="flex flex-col md:flex-row justify-center items-center mb-8 gap-4">
        <input
          type="text"
          placeholder=" Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      {/* Skills Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {skills.map((skill) => (
          <div
            key={skill._id}
            className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Profile Section */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={skill.userImage || "https://via.placeholder.com/80"}
                alt={skill.userName}
                className="w-20 h-20 rounded-full object-cover ring-2 ring-blue-500"
              />
              <div>
                <h2 className="text-lg font-semibold">{skill.userName}</h2>
                <p className="text-gray-600">{skill.studyOrWorking}</p>
              </div>
            </div>

            {/* Skill & Description */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs px-3 py-1 rounded-full shadow">
                {skill.skillName}
              </span>
              {skill.tags?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-gray-600 flex-1">
              {skill.description.length > 120
                ? skill.description.slice(0, 120) + "..."
                : skill.description}
            </p>

            {/* Extra Info */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-500">
              <span>📌 Experience: {skill.experience}</span>
              <span>⏰ {skill.availability}</span>
              <span>📍 {skill.location}</span>
              <span>⭐ {skill.rating} ({skill.reviewsCount})</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-5 flex-wrap">
              <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition shadow">
                <MessageSquare size={16} /> Message
              </button>
              <Link
                href={`/find-skills/${skill._id}`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow"
              >
                <Eye size={16} /> See Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-10">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
        >
          Prev
        </button>
        <span className="px-4 py-2 border rounded-lg bg-gray-50 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
