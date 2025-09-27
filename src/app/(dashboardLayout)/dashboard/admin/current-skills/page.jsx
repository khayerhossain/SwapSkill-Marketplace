"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";
import { Eye, EyeOff, Trash2, Search } from "lucide-react";

export default function CurrentSkills() {
  const [skills, setSkills] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const { data } = await axiosInstance.get("/current-skills");
      setSkills(data);
    } catch (error) {
      console.error("Failed to fetch skills", error);
    }
  };

  const handleVisibilityToggle = async (id, currentVisibility) => {
    const newVisibility = currentVisibility === "showing" ? "hide" : "showing";
    try {
      await axiosInstance.patch("/current-skills", { id, visibility: newVisibility });
      setSkills((prev) =>
        prev.map((s) =>
          String(s._id) === String(id)
            ? { ...s, visibility: newVisibility }
            : s
        )
      );
    } catch {
      Swal.fire("Error!", "Failed to update visibility.", "error");
    }
  };

  const handleRemove = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This skill will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/current-skills?id=${id}`);
          setSkills((prev) => prev.filter((s) => String(s._id) !== String(id)));
          Swal.fire("Deleted!", "Skill has been removed.", "success");
        } catch {
          Swal.fire("Error!", "Failed to delete skill.", "error");
        }
      }
    });
  };

  const filteredSkills = skills.filter((s) => {
    const matchesSearch = s.userName?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || s.visibility === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="max-w-6xl mx-auto mt-12 p-6 sm:p-8 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        All Current Skills
      </h2>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by user name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
        >
          <option value="all">All</option>
          <option value="showing">Showing</option>
          <option value="hide">Hidden</option>
        </select>
      </div>

      {/* desktop screens */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Image</th>
              <th className="px-14 py-4 text-sm font-semibold text-gray-600">User</th>
              <th className="px-10 py-4 text-sm font-semibold text-gray-600">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Visibility</th>
              <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredSkills.map((skill) => (
              <tr key={skill._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-center">
                  <img
                    src={skill.userImage || "/default-avatar.png"}
                    alt={skill.userName}
                    className="w-14 h-14 rounded-full object-cover border border-gray-300 mx-auto"
                  />
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-800">{skill.userName}</p>
                  <p className="text-sm text-gray-500">{skill.contactInfo.email || "No email"}</p>
                </td>
                <td className="px-6 py-4 text-gray-700">{skill.category || "N/A"}</td>
                <td className="px-6 py-4 text-center ">
                  <button
                    onClick={() => handleVisibilityToggle(skill._id, skill.visibility)}
                    className={`cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition mx-auto ${
                      skill.visibility === "showing"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {skill.visibility === "showing" ? (
                      <>
                        <Eye className="w-4 h-4" /> Showing
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" /> Hidden
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleRemove(skill._id)}
                    className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition text-sm flex items-center gap-2 mx-auto"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </td>
              </tr>
            ))}
            {filteredSkills.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500 italic">
                  No skills found...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card layout for small screens */}
      <div className="lg:hidden space-y-4">
        {filteredSkills.map((skill) => (
          <div key={skill._id} className="border rounded-xl p-4 shadow-sm bg-gray-50">
            <div className="flex items-center gap-4">
              <img
                src={skill.userImage || "/default-avatar.png"}
                alt={skill.userName}
                className="w-14 h-14 rounded-full object-cover border border-gray-300"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{skill.userName}</p>
                <p className="text-sm text-gray-500">{skill.contactInfo.email || "No email"}</p>
                <p className="text-sm text-gray-600 mt-1">Category: {skill.category || "N/A"}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
              <button
                onClick={() => handleVisibilityToggle(skill._id, skill.visibility)}
                className={`flex items-center justify-center gap-2 px-4 py-1 rounded-lg font-medium text-sm shadow-sm transition ${
                  skill.visibility === "showing"
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {skill.visibility === "showing" ? (
                  <>
                    <Eye className="w-4 h-4" /> Showing
                  </>
                ) : (
                  <>
                    <EyeOff className="w-4 h-4" /> Hidden
                  </>
                )}
              </button>
              <button
                onClick={() => handleRemove(skill._id)}
                className="bg-red-500 text-white px-4 py-1 rounded-lg shadow hover:bg-red-600 transition text-sm flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Remove
              </button>
            </div>
          </div>
        ))}
        {filteredSkills.length === 0 && (
          <p className="text-center text-gray-500 italic py-6">No skills found...</p>
        )}
      </div>
    </section>
  );
}
