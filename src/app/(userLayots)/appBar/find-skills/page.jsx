"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { Eye, Clock, Star, Briefcase, MapPin, Bookmark } from "lucide-react";
import Container from "@/components/shared/Container";
import Loading from "@/app/loading";
import { useSession } from "next-auth/react";
import Swal from "sweetalert2";

// loading function
function SkeletonCard({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-[#111111] border border-gray-800 rounded-2xl p-6 ${className}`}
    >
      <div className="h-6 bg-gray-800 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-800 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-800 rounded w-3/4"></div>
    </div>
  );
}

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("newest");
  const limit = 6;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axiosInstance.get(`/find-skills`, {
          params: { search: searchQuery, page, limit, sort },
        });

        if (data.success) {
          setSkills(data.skills || []);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error(data.message || "Failed to fetch skills");
        }
      } catch (err) {
        setError(err.message || "Failed to load skills. Please try again.");
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, [searchQuery, page, sort]);

  const handleSearch = () => {
    setPage(1);
    setSearchQuery(searchInput.trim());
  };

  const handleSaveSkill = async (skill) => {
    try {
      const userEmail = session?.user?.email;
      if (!userEmail) {
        alert("Please login to save this skill.");
        return;
      }

      const { data } = await axiosInstance.post("/saved-skills", {
        skillData: skill,
        userEmail,
      });

      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "Skill saved successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed!",
          text: "Failed to save skill. Try again.",
        });
      }
    } catch (error) {
      console.error("Save failed:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong while saving skill.",
      });
    }
  };

  const tagColors = [
    "bg-red-600 text-white",
    "bg-gray-700 text-white",
    "bg-red-600 text-white",
    "bg-gray-600 text-white",
    "bg-red-600 text-white",
  ];

  const highlightTags = ["React", "Next", "CSS"];

  return (
    <section className="min-h-screen bg-[#111111] text-white py-12">
      <Container>
        <div className="mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col mb-10">
            <h1 className="text-4xl font-bold mb-2">
              Find & <span className="text-red-500">Swap Skills</span>
            </h1>
            <p className="text-gray-400 mb-6 max-w-lg text-base">
              Discover new skills, connect with experts, and exchange knowledge
              in a sleek dark marketplace.
            </p>
            <div className="w-1/2 border-t border-gray-700 mb-6"></div>

            {/* Search + Sort + Match */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className=" px-4 py-2 rounded-md w-80 backdrop-blur-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none shadow-sm"
                />
                <button
                  onClick={handleSearch}
                  className="px-4 py-2 bg-red-500 text-white rounded-md "
                >
                  Search
                </button>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-gray-700 px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md shadow transition">
                  Match
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-400 px-4 py-3 rounded mb-6 flex justify-between items-center">
              <span>Error: {error}</span>
              <button
                onClick={() => setError("")}
                className="text-red-300 font-bold text-xl"
              >
                ×
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && <Loading />}

          {/* No Skills */}
          {!loading && !error && skills.length === 0 && (
            <div className="min-h-screen bg-[#070707] flex items-center justify-center p-6">
              <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-6">
                <SkeletonCard />
                <div className="space-y-4">
                  <SkeletonCard className="h-40" />
                  <SkeletonCard className="h-40" />
                </div>
              </div>
            </div>
          )}

          {/* Skill Cards */}
          {!loading && !error && skills.length > 0 && (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {skills.map((skill) => (
                  <div
                    key={skill._id}
                    className="bg-[#0f0f0f] border border-gray-800 p-6 rounded-2xl shadow-md flex flex-col hover:scale-[1.02] hover:shadow-2xl transition-transform duration-300"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={
                          skill.userImage || "https://via.placeholder.com/80"
                        }
                        alt={skill.userName}
                        className="w-20 h-20 rounded-full object-cover ring-2 ring-red-600"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold text-white">
                            {skill.userName || "Unknown"}
                          </h2>
                          <span className="text-white bg-blue-600 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Verified
                          </span>
                        </div>
                        <span className="inline-block mt-1 text-xs font-medium p-1 py-1backdrop-blur-xl bg-white/5 border border-white/10text-white rounded-md max-w-max">
                          {skill.category || "Uncategorized"}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {skill.tags && skill.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {skill.tags.slice(0, 3).map((tag, i) => {
                          const isHighlight = highlightTags.includes(tag);
                          return (
                            <span
                              key={tag}
                              className={`text-xs px-2 py-1 rounded-full font-medium ${
                                isHighlight
                                  ? "backdrop-blur-xl bg-white/5 border border-white/10 text-white"
                                  : tagColors[i % tagColors.length]
                              }`}
                            >
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-gray-300 flex-1 leading-relaxed">
                      {skill.description
                        ? skill.description.length > 120
                          ? skill.description.slice(0, 120) + "..."
                          : skill.description
                        : "No description available."}
                    </p>

                    {/* Extra Info */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Briefcase size={16} />{" "}
                        {skill.experience || "Not specified"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} />{" "}
                        {skill.availability || "Not specified"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={16} /> {skill.location || "Not specified"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={16} /> {skill.rating || "0"} (
                        {skill.reviewsCount || 0})
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex mt-6 gap-3">
                      <button
                        onClick={() => handleSaveSkill(skill)}
                        className="flex items-center justify-center gap-2 w-1/2 bg-[#111111] border border-[#2c2c2c] text-gray-200 px-4 py-2 rounded-xl font-medium hover:bg-[#1e1e1e] hover:border-[#444] hover:text-white transition"
                      >
                        <Bookmark className="w-5 h-5" /> Save
                      </button>
                      <Link
                        href={`/appBar/find-skills/${skill._id}`}
                        className="flex items-center justify-center gap-2 w-1/2  bg-[#111111] border border-[#2c2c2c] text-gray-200 px-4 py-2 rounded-xl font-medium hover:bg-[#1e1e1e] hover:border-[#444] hover:text-white transition"
                      >
                        <Eye size={16} /> See Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-10 flex-wrap">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition shadow disabled:opacity-50"
                  >
                    Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 rounded-lg transition shadow ${
                        page === i + 1
                          ? "bg-red-600 text-white scale-110 shadow-lg"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      setPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={page === totalPages}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition shadow disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
