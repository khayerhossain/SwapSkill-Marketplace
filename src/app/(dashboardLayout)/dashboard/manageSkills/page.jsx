"use client";

import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiEye, FiSearch, FiFilter } from "react-icons/fi";
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
      if (data.success) {
        setAttempts(data.attempts);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch attempts");
    }
    setLoading(false);
  };

const handleAction = async (profileId, attemptId, action) => {
  const result = await Swal.fire({
    title: `Are you sure?`,
    text: `You want to ${action} this attempt?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: `Yes, ${action} it!`,
  });

  if (!result.isConfirmed) return;

  setActionLoading(true);
  try {
    const res = await fetch("/api/admin/update-verification", {
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

      Swal.fire(
        "Done!",
        `Attempt ${action}d successfully.`,
        "success"
      );
    } else {
      Swal.fire("Error!", data.message, "error");
    }
  } catch (err) {
    console.error(err);
    Swal.fire("Error!", "Server error occurred", "error");
  }
  setActionLoading(false);
};

  // Filtered attempts based on search and filters
  const filteredAttempts = attempts.filter((attempt) => {
    const matchesSearch = 
      attempt.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attempt.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || attempt.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || attempt.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Get unique categories for filter
  const categories = [...new Set(attempts.map(attempt => attempt.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Quiz Skills</h1>
          <p className="text-gray-600">Review and manage user quiz attempts</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Attempts</p>
                <p className="text-2xl font-bold text-gray-900">{attempts.length}</p>
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
                  {attempts.filter(a => a.status === "pending").length}
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
                <p className="text-2xl font-bold text-green-600">
                  {attempts.filter(a => a.status === "approved").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">
                  {attempts.filter(a => a.status === "rejected").length}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <FiXCircle className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users, emails, categories..."
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
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCategoryFilter("all");
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredAttempts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No quiz attempts found</h3>
              <p className="text-gray-600">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAttempts.map((attempt) => (
                    <tr key={attempt._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {attempt.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {attempt.userName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{attempt.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {attempt.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-medium">
                          {attempt.score}/{attempt.totalQuestions}
                        </div>
                        <div className="text-xs text-gray-500">
                          {((attempt.score / attempt.totalQuestions) * 100).toFixed(1)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {attempt.status === "approved" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <FiCheckCircle className="mr-1" /> Approved
                          </span>
                        ) : attempt.status === "rejected" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            <FiXCircle className="mr-1" /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            <MdOutlinePendingActions className="mr-1" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAction(attempt.profileId, attempt._id, "approve")}
                            disabled={actionLoading || attempt.status === "approved"}
                            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              attempt.status === "approved"
                                ? "bg-green-100 text-green-400 cursor-not-allowed"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            }`}
                            title="Approve"
                          >
                            <FiCheckCircle className="mr-1" /> Approve
                          </button>
                          <button
                            onClick={() => handleAction(attempt.profileId, attempt._id, "reject")}
                            disabled={actionLoading || attempt.status === "rejected"}
                            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                              attempt.status === "rejected"
                                ? "bg-red-100 text-red-400 cursor-not-allowed"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                            title="Reject"
                          >
                            <FiXCircle className="mr-1" /> Reject
                          </button>
                          <button
                            onClick={() => setSelectedAttempt(attempt)}
                            className="inline-flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-200 transition-colors"
                            title="View Details"
                          >
                            <FiEye className="mr-1" /> View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Quiz Attempt Details</h2>
                <button
                  onClick={() => setSelectedAttempt(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiXCircle size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">User Information</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">{selectedAttempt.userName}</p>
                      <p className="text-sm text-gray-600">{selectedAttempt.userEmail}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Quiz Details</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg space-y-2">
                      <p><strong>Category:</strong> {selectedAttempt.category}</p>
                      <p><strong>Total Questions:</strong> {selectedAttempt.totalQuestions}</p>
                      <p><strong>Score:</strong> {selectedAttempt.score}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Results</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg space-y-2">
                      <p><strong>Percentage:</strong> {selectedAttempt.percentage}%</p>
                      <p><strong>Passed:</strong> 
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          selectedAttempt.passed 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {selectedAttempt.passed ? "Yes" : "No"}
                        </span>
                      </p>
                      <p><strong>Badge:</strong> 
                        <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {selectedAttempt.badgeType || "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Performance</label>
                    <div className="mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full" 
                          style={{ width: `${selectedAttempt.percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mt-1">
                        <span>0%</span>
                        <span>{selectedAttempt.percentage}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedAttempt(null)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleAction(selectedAttempt.profileId, selectedAttempt._id, "approve")}
                  disabled={selectedAttempt.status === "approved"}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedAttempt.status === "approved"
                      ? "bg-green-300 text-white cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Approve Attempt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}