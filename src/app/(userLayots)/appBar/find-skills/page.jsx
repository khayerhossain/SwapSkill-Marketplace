"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Eye,
  Clock,
  Star,
  Briefcase,
  MapPin,
} from "lucide-react";
import Container from "@/components/shared/Container";

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

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("Fetching skills with params:", { searchQuery, page, limit, sort });
        
        const res = await fetch(
          `/api/find-skills?search=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}&sort=${sort}`
        );
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("API response:", data);
        
        if (data.success) {
          setSkills(data.skills || []);
          setTotalPages(data.totalPages || 1);
        } else {
          throw new Error(data.message || "Failed to fetch skills");
        }
      } catch (err) {
        console.error("Error fetching skills:", err);
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

  // Different tag colors
  const tagColors = [
    "bg-pink-100 text-pink-700",
    "bg-green-100 text-green-700",
    "bg-yellow-100 text-yellow-700",
    "bg-blue-100 text-blue-700",
    "bg-purple-100 text-purple-700",
  ];

  return (
    <section>
      <Container>
        <div className="mx-auto px-4">
          {/* Title + Description + Search + Sorting */}
          <div className="flex flex-col mb-6">
            {/* Left section */}
            <div className="flex-1 pr-6">
              <h1 className="text-4xl font-bold mb-3">
                Find & <span className="text-red-500">Swap Skills</span>
              </h1>
              <p className="text-gray-600 mb-4 max-w-lg text-base">
                Search for skills, connect with people, and exchange knowledge
                to grow together.
              </p>

              {/* HR line */}
              <div className="w-1/2 border-t border-gray-300 mb-4"></div>

              {/* Search + Sorting in one line */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                {/* Search box + button */}
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Search skills..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded-md text-sm w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSearch();
                    }}
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 transition shadow cursor-pointer"
                  >
                    Search
                  </button>
                </div>

                {/* Sorting dropdown */}
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>Error: </strong>{error}
              <button 
                onClick={() => setError("")}
                className="float-right text-red-800 font-bold"
              >
                ×
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Loading skills...</p>
            </div>
          )}
          
          {!loading && !error && skills.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg mb-2">No Skills Found!</p>
              <p className="text-gray-400">
                {searchQuery 
                  ? `No results for "${searchQuery}". Try a different search term.`
                  : "No skills available at the moment. Check back later."
                }
              </p>
            </div>
          )}

          {/* Cards */}
          {!loading && !error && skills.length > 0 && (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                {skills.map((skill) => (
                  <div
                    key={skill._id}
                    className="bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={skill.userImage || "https://via.placeholder.com/80"}
                        alt={skill.userName}
                        className="w-20 h-20 rounded-full object-cover ring-2 ring-blue-500"
                      />
                      <div>
                        <h2 className="text-lg font-semibold">{skill.userName || "Unknown User"}</h2>
                        {/* Highlighted category */}
                        <span className="inline-block mt-1 text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-md">
                          {skill.category || "Uncategorized"}
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    {skill.tags && skill.tags.length > 0 && (
                      <div className="flex items-center gap-2 mb-3 flex-wrap">                  
                        {skill.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={tag}
                            className={`${
                              tagColors[i % tagColors.length]
                            } text-xs px-2 py-1 rounded-full`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-gray-600 flex-1">
                      {skill.description ? (
                        skill.description.length > 120
                          ? skill.description.slice(0, 120) + "..."
                          : skill.description
                      ) : (
                        "No description available."
                      )}
                    </p>

                    {/* Extra Info */}
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Briefcase size={16} /> {skill.experience || "Not specified"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={16} /> {skill.availability || "Not specified"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={16} /> {skill.location || "Not specified"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={16} /> {skill.rating || "0"} ({skill.reviewsCount || 0})
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex mt-5 gap-3">
                      <button className="flex items-center justify-center gap-2 w-1/2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition shadow cursor-pointer">
                        <MessageSquare size={16} /> Message
                      </button>
                      <Link
                        href={`/appBar/find-skills/${skill._id}`}
                        className="flex items-center justify-center gap-2 w-1/2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition shadow cursor-pointer"
                      >
                        <Eye size={16} /> See Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
                  >
                    Prev
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        page === i + 1
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
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