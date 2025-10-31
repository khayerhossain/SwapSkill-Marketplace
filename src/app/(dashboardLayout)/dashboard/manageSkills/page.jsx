"use client";
import Loading from "@/app/loading";
import React, { useState, useEffect } from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiSearch,
  FiFilter,
} from "react-icons/fi";
import { MdOutlinePendingActions } from "react-icons/md";
import Swal from "sweetalert2";

export default function ManageSkills() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/get-quiz-attempts");
      const data = await res.json();
      if (data.success) setAttempts(data.attempts);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch attempts");
    }

    setLoading(false);
  };

  const handleAction = async (profileId, attemptId, action) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You want to ${action} this attempt? 
      ${
        action === "reject" ? "This will delete the attempt permanently!" : ""
      }`,

      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Yes, ${action} it!`,
    });

    if (!result.isConfirmed) return;

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/get-quiz-attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId, attemptId, action }),
      });
      const data = await res.json();

      if (data.success) {
        setAttempts((prev) =>
          prev.map((a) =>
            a._id === attemptId
              ? {
                  ...a,
                  status: action === "approve" ? "approved" : "pending",
                  verification: action === "approve",
                }
              : a
          )
        );
        setSelectedAttempt(null);
        Swal.fire("Done!", `Attempt ${action}d successfully.`, "success");
      } else {
        Swal.fire("Error!", data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error!", "Server error occurred", "error");
    }
    setActionLoading(false);
  };

  const filteredAttempts = attempts.filter((attempt) => {
    const matchesSearch =
      attempt.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || attempt.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || attempt.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = [...new Set(attempts.map((a) => a.category))];

  if (loading)
    return (
      <div>
        <Loading />
      </div>
    );

  return (
    <div className="min-h-screen text-white">
      <div className=" mx-auto">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold mb-1 text-white">
           <span className="text-red-500">Review</span> and Manage Users Skills
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Review and manage user quiz results with ease.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Attempts",
              count: attempts.length,
              icon: (
                <MdOutlinePendingActions className="text-blue-400 text-xl" />
              ),
              color: "from-blue-500/30 to-purple-500/30",
            },
            {
              title: "Pending",
              count: attempts.filter((a) => a.status === "pending").length,
              icon: (
                <MdOutlinePendingActions className="text-yellow-400 text-xl" />
              ),
              color: "from-yellow-500/30 to-orange-500/30",
            },
            {
              title: "Approved",
              count: attempts.filter((a) => a.status === "approved").length,
              icon: <FiCheckCircle className="text-green-400 text-xl" />,
              color: "from-green-500/30 to-emerald-500/30",
            },
            {
              title: "Rejected",
              count: attempts.filter((a) => a.status === "rejected").length,
              icon: <FiXCircle className="text-red-400 text-xl" />,
              color: "from-red-500/30 to-pink-500/30",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`rounded-xl p-6 backdrop-blur-xl bg-gradient-to-br ${card.color} border border-white/10 shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-300">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-white">{card.count}</p>
                </div>
                <div className="p-3 bg-white/10 rounded-full">{card.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-transparent border border-white/20 rounded-lg focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="all" className="bg-gray-900">
                All Status
              </option>
              <option value="pending" className="bg-gray-900">
                Pending
              </option>
              <option value="approved" className="bg-gray-900">
                Approved
              </option>
              <option value="rejected" className="bg-gray-900">
                Rejected
              </option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent border border-white/20 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="all" className="bg-gray-900">
                All Categories
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-gray-900">
                  {cat}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
              className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg text-gray-200 hover:from-gray-600 hover:to-gray-700 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table / Mobile Cards */}
        {filteredAttempts.length === 0 ? (
          <div className="text-center py-12 backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl">
            <div className="text-6xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-200 mb-1">
              No Applied Users Found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className=" backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl overflow-x-auto shadow-lg">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    {[
                      "Profile",
                      "Name",
                      "Category",
                      "Score",
                      "Status",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAttempts.map((a) => (
                    <tr
                      key={a._id}
                      className="hover:bg-white/10 transition border-b border-white/10"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={a.userImage}
                          alt="images"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td>{a.userName}</td>
                      <td>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/20 text-blue-300">
                          {a.category}
                        </span>
                      </td>
                      <td>
                        <div className="text-sm font-medium text-gray-200">
                          {a.score}/{a.totalQuestions}
                        </div>
                        <div className="text-xs text-gray-400">
                          {((a.score / a.totalQuestions) * 100).toFixed(1)}%
                        </div>
                      </td>
                      <td>
                        {a.status === "approved" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500/20 text-green-300">
                            <FiCheckCircle className="mr-1" /> Approved
                          </span>
                        ) : a.status === "rejected" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-300">
                            <FiXCircle className="mr-1" /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-300">
                            <MdOutlinePendingActions className="mr-1" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleAction(a.profileId, a._id, "approve")
                            }
                            disabled={a.status === "approved"}
                            className={`px-3 py-2 rounded-md transition ${
                              a.status === "approved"
                                ? "bg-green-500/10 text-green-400 cursor-not-allowed"
                                : "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                            }`}
                          >
                            <FiCheckCircle className="mr-1 inline" /> Approve
                          </button>
                          <button
                            onClick={() =>
                              handleAction(a.profileId, a._id, "reject")
                            }
                            disabled={a.status === "rejected"}
                            className={`px-3 py-2 rounded-md transition ${
                              a.status === "rejected"
                                ? "bg-red-500/10 text-red-400 cursor-not-allowed"
                                : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                            }`}
                          >
                            <FiXCircle className="mr-1 inline" /> Reject
                          </button>
                          <button
                            onClick={() => setSelectedAttempt(a)}
                            className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-md hover:bg-blue-500/30 transition"
                          >
                            <FiEye className="mr-1 inline" /> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
