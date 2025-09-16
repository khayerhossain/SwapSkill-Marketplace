"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  Briefcase,
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("newest");
  const limit = 4;

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
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* 🔹 Title */}
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8 mt-10">
        Explore Skills
      </h1>

      {/* 🔹 Search & Sort */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
        <div className="relative w-full md:w-2/3">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-5 py-3 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="px-5 py-3 border border-gray-200 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="newest">Sort by Newest</option>
          <option value="oldest">Sort by Oldest</option>
        </select>
      </div>

      {/* 🔹 Skills Cards */}
      {skills.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No skills found...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="group flex items-center bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300"
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={skill.userImage || "https://via.placeholder.com/80"}
                  alt={skill.userName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Main Info */}
              <div className="flex-1 ml-6">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition">
                    {skill.userName}
                  </h2>
                  <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    {skill.skillName}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {skill.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Briefcase size={15} /> {skill.experience}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={15} /> {skill.availability}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={15} /> {skill.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={15} className="text-yellow-400" />{" "}
                    {skill.rating} ({skill.reviewsCount})
                  </span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-2 ml-6">
                <button className="px-5 py-2 rounded-full bg-green-500 text-white font-medium shadow hover:bg-green-600 transition">
                  Message
                </button>
                <Link
                  href={`/find-skills/${skill._id}`}
                  className="px-5 py-2 rounded-full bg-blue-500 text-white font-medium text-center shadow hover:bg-blue-600 transition"
                >
                  See Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-12">
        {/* Prev Button */}
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`flex items-center justify-center w-10 h-10 rounded-full border transition 
      ${
        page === 1
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white text-gray-700 hover:bg-gray-100 shadow"
      }`}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Number */}
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white font-semibold shadow-md">
          {page}
        </span>

        {/* Next Button */}
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`flex items-center justify-center w-10 h-10 rounded-full border transition 
      ${
        page === totalPages
          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
          : "bg-white text-gray-700 hover:bg-gray-100 shadow"
      }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
