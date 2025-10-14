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
    }     catch (err) {
      console.error(err);
      alert("Failed to fetch attempts");
    }


    setLoading(false);
  };

  const handleAction = async (profileId, attemptId, action) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You want to ${action} this attempt? 
      ${action === "reject" ? "This will delete the attempt permanently!" : ""}`,
      
      
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}

        <div className="mb-6 sm:mb-8 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
            Manage Quiz Skills
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Review and manage user skills by their test </p>          
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
         <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Attempts
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {attempts.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <MdOutlinePendingActions className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {attempts.filter((a) => a.status === "pending").length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <MdOutlinePendingActions className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-blue-600">
                  {attempts.filter((a) => a.status === "approved").length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiCheckCircle className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {attempts.filter((a) => a.status === "rejected").length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <FiXCircle className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users or categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
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
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table / Mobile Cards */}
        
        {filteredAttempts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Applied Users Found
            </h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    {["Profile", "Name", "Category", "Score", "Status", "Actions"].map(
                      (header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAttempts.map((a) => (
                    <tr key={a._id} className="hover:bg-gray-500">
                      <td className="px-6 py-4">
                        <img
                          src={a.userImage}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </td>
                      <td>{a.userName}</td>
                      <td>
                        <span className="px-3 py-1 inline-flex text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {a.category}
                        </span>
                      </td>
                      <td>
                        <div className="text-sm font-medium text-gray-900">
                          {a.score}/{a.totalQuestions}
                        </div>
                        <div className="text-xs text-gray-500">
                          {((a.score / a.totalQuestions) * 100).toFixed(1)}%
                        </div>
                      </td>
                      <td>
                        {a.status === "approved" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <FiCheckCircle className="mr-1" /> Approved
                          </span>
                        ) : a.status === "rejected" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            <FiXCircle className="mr-1" /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
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
                            className={`px-3 py-2 rounded-md ${
                              a.status === "approved"
                                ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                            }`}
                          >
                            <FiCheckCircle className="mr-1 inline" /> Approve
                          </button>
                          <button
                            onClick={() =>
                              handleAction(a.profileId, a._id, "reject")
                            }
                            disabled={a.status === "rejected"}
                            className={`px-3 py-2 rounded-md ${
                              a.status === "rejected"
                                ? "bg-red-100 text-red-400 cursor-not-allowed"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            <FiXCircle className="mr-1 inline" /> Reject
                          </button>
                          <button
                            onClick={() => setSelectedAttempt(a)}
                            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
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

            {/* Mobile View (Cards) */}
            <div className="block md:hidden space-y-4">
              {filteredAttempts.map((a) => (
                <div key={a._id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center space-x-3">
                    <img
                      src={a.userImage}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {a.userName}
                      </h3>
                      <p className="text-sm text-gray-600">{a.category}</p>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-gray-700">
                    <p>
                      <strong>Score:</strong> {a.score}/{a.totalQuestions}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span className="capitalize">{a.status}</span>
                    </p>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedAttempt(a)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm hover:bg-blue-200"
                    >
                      <FiEye className="inline mr-1" /> View
                    </button>
                    <button
                      onClick={() =>
                        handleAction(a.profileId, a._id, "approve")
                      }
                      disabled={a.status === "approved"}
                      className={`px-3 py-1 text-sm rounded-md ${
                        a.status === "approved"
                          ? "bg-blue-100 text-blue-400 cursor-not-allowed"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      }`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleAction(a.profileId, a._id, "reject")
                      }
                      disabled={a.status === "rejected"}
                      className={`px-3 py-1 text-sm rounded-md ${
                        a.status === "rejected"
                          ? "bg-red-100 text-red-400 cursor-not-allowed"
                          : "bg-red-100 text-red-700 hover:bg-red-200"
                      }`}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* View Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                Quiz Attempt Details
              </h2>
              <button
                onClick={() => setSelectedAttempt(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiXCircle size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] text-sm sm:text-base">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      User Information
                    </label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">
                        {selectedAttempt.userName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedAttempt.userEmail}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Quiz Details
                    </label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg space-y-2">
                      <p>
                        <strong>Category:</strong> {selectedAttempt.category}
                      </p>
                      <p>
                        <strong>Total Questions:</strong>{" "}
                        {selectedAttempt.totalQuestions}
                      </p>
                      <p>
                        <strong>Score:</strong> {selectedAttempt.score}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Results
                    </label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg space-y-2">
                      <p>
                        <strong>Percentage:</strong>{" "}
                        {selectedAttempt.percentage}%
                      </p>
                      <p>
                        <strong>Passed:</strong>{" "}
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            selectedAttempt.passed
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedAttempt.passed ? "Yes" : "No"}
                        </span>
                      </p>
                      <p>
                        <strong>Badge:</strong>{" "}
                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {selectedAttempt.badgeType || "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Performance
                    </label>
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            selectedAttempt.passed
                              ? "bg-blue-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${selectedAttempt.percentage}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-right text-xs mt-1 text-gray-500">
                        {selectedAttempt.percentage}%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="border-t border-gray-200 px-6 py-4 flex flex-col sm:flex-row justify-end gap-2 sm:gap-4">
              <button
                onClick={() =>
                  handleAction(
                    selectedAttempt.profileId,
                    selectedAttempt._id,
                    "approve"
                  )
                }
                disabled={actionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {actionLoading ? "Processing..." : "Approve"}
              </button>
              <button
                onClick={() =>
                  handleAction(
                    selectedAttempt.profileId,
                    selectedAttempt._id,
                    "reject"
                  )
                }
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                {actionLoading ? "Processing..." : "Reject"}
              </button>
              <button
                onClick={() => setSelectedAttempt(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
