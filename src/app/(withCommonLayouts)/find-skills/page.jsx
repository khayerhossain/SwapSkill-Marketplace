"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("newest");
  const limit = 5;

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
    <div className="max-w-5xl mx-auto mt-10 p-4">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-center mb-6">Explore Skills</h1>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <input
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="newest">Sort by Newest</option>
          <option value="oldest">Sort by Oldest</option>
        </select>
      </div>

      {/* Skills Cards */}
      <div className="flex flex-col gap-6">
        {skills.map((skill) => (
          <div
            key={skill._id}
            className="flex flex-col md:flex-row items-start md:items-center border border-gray-200 p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            {/* Profile Picture */}
            <img
              src={skill.userImage || "https://via.placeholder.com/80"}
              alt={skill.userName}
              className="w-20 h-20 rounded-full object-cover mr-4 mb-4 md:mb-0"
            />

            {/* Main Info */}
            <div className="flex-1 flex flex-col gap-1">
              {/* Username & Title */}
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">{skill.userName}</h2>
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {skill.skillName}
                </span>
              </div>

              {/* Short Description */}
              <p className="text-gray-600">{skill.description}</p>

              {/* Extra Info */}
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                <span>Experience: {skill.experience}</span>
                <span>Availability: {skill.availability}</span>
                <span>Location: {skill.location}</span>
                <span>Rating: {skill.rating} ({skill.reviewsCount} reviews)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0 md:ml-4">
              <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
                Message
              </button>
              <Link
  href={`/find-skills/${skill._id}`}
  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
>
  See Details
</Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
        >
          Prev
        </button>
        <span className="px-3 py-1 border rounded">{page}</span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
