"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";
import { Eye, EyeOff, Trash2, Info } from "lucide-react";
import { MdOutlinePendingActions } from "react-icons/md";
import Loading from "@/app/loading";
import { FiXCircle } from "react-icons/fi";

export default function CurrentSkills() {
  const [skills, setSkills] = useState([]);
  const [search] = useState("");
  const [filter] = useState("all");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [loading, setLoading] = useState(true);

  //  Fetch Skills
  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/current-skills");
      setSkills(data);
    } catch (error) {
      console.error(" Failed to fetch skills", error);
      Swal.fire("Error", "Failed to load skills", "error");
    } finally {
      setLoading(false);
    }
  };

  //  Handle Visibility Toggle
  const handleVisibilityToggle = async (id, currentVisibility) => {
    const newVisibility = currentVisibility === "showing" ? "hide" : "showing";
    try {
      await axiosInstance.patch("/current-skills", {
        id,
        visibility: newVisibility,
      });
      setSkills((prev) =>
        prev.map((s) =>
          String(s._id) === String(id) ? { ...s, visibility: newVisibility } : s
        )
      );
      //Swal.fire("Updated!", `Skill visibility changed to "${newVisibility}"`, "success");
    } catch {
      Swal.fire("Error!", "Failed to update visibility.", "error");
    }
  };

  //  Delete Skill
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

  //  Filter Logic
  const filteredSkills = skills.filter((s) => {
    const matchesSearch = s.userName
      ?.toLowerCase()
      .includes(search.toLowerCase());
    const matchesFilter = filter === "all" || s.visibility === filter;
    return matchesSearch && matchesFilter;
  });

  //  Loader
  if (loading) {
    return (
      <div className="min-h-screen">
        <Loading></Loading>
      </div>
    );
  }

  return (
    <section className="min-h-screen text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-8 text-center sm:text-left bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          All Current Skills
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              title: "Total Skills",
              count: skills.length,
              color: "from-blue-500/30 to-purple-500/30",
              icon: (
                <MdOutlinePendingActions className="text-blue-400 text-xl" />
              ),
            },
            {
              title: "Hidden",
              count: skills.filter((a) => a.visibility === "hide").length,
              color: "from-yellow-500/30 to-orange-500/30",
              icon: <EyeOff className="text-yellow-400 text-xl" />,
            },
            {
              title: "Showing",
              count: skills.filter((a) => a.visibility === "showing").length,
              color: "from-green-500/30 to-emerald-500/30",
              icon: <Eye className="text-green-400 text-xl" />,
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

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-hidden rounded-xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-lg">
          <table className="w-full text-left">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-blue-400 text-center">
                  Image
                </th>
                <th className="px-10 py-4 text-sm font-semibold text-blue-400">
                  User
                </th>
                <th className="px-8 py-4 text-sm font-semibold text-blue-400">
                  Category
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-blue-400 text-center">
                  Visibility
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-blue-400 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredSkills.map((skill, index) => (
                <tr
                  key={skill._id}
                  className="hover:bg-white/10 transition border-b border-white/10"
                >
                  <td className="px-6 py-4 text-center align-middle">
                    <img
                      src={skill.userImage || "/default-avatar.png"}
                      alt={skill.userName}
                      className="w-14 h-14 rounded-full object-cover border border-white/20 mx-auto"
                    />
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <p className="font-medium text-white">{skill.userName}</p>
                    <p className="text-sm text-gray-400">
                      {skill.contactInfo.email || "No email"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-gray-300 align-middle">
                    {skill.category || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center align-middle">
                    <button
                      onClick={() =>
                        handleVisibilityToggle(skill._id, skill.visibility)
                      }
                      className={`cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all shadow-none focus:outline-none ${
                        skill.visibility === "showing"
                          ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                          : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                      }`}
                    >
                      {skill.visibility === "showing" ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center align-middle">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setSelectedSkill(skill)}
                        className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded-lg shadow-none focus:outline-none transition flex items-center gap-1"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRemove(skill._id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-lg shadow-none focus:outline-none transition flex items-center gap-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSkills.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-gray-400 italic"
                  >
                    No skills found...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile / Tablet Card Layout */}
        <div className="lg:hidden space-y-4 mt-6">
          {filteredSkills.map((skill) => (
            <div
              key={skill._id}
              className="rounded-xl p-4 backdrop-blur-xl bg-white/5 border border-white/10 shadow-md hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={skill.userImage || "/default-avatar.png"}
                  alt={skill.userName}
                  className="w-14 h-14 rounded-full object-cover border border-white/20"
                />
                <div className="flex-1">
                  <p className="font-medium text-white">{skill.userName}</p>
                  <p className="text-sm text-gray-400">
                    {skill.contactInfo.email || "No email"}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Category: {skill.category || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between mt-4 gap-2">
                <button
                  onClick={() =>
                    handleVisibilityToggle(skill._id, skill.visibility)
                  }
                  className={`flex items-center justify-center gap-2 px-4 py-1 rounded-lg font-medium text-sm transition-all shadow-none focus:outline-none ${
                    skill.visibility === "showing"
                      ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                      : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                  }`}
                >
                  {skill.visibility === "showing" ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedSkill(skill)}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-1 rounded-lg shadow-none focus:outline-none transition"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemove(skill._id)}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-1 rounded-lg shadow-none focus:outline-none transition flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredSkills.length === 0 && (
            <p className="text-center text-gray-400 italic py-6">
              No skills found...
            </p>
          )}
        </div>

        {/* Modal for Details */}
        {selectedSkill && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  Skill Details
                </h2>
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="text-gray-400 hover:text-red-400 transition"
                >
                  <FiXCircle size={24} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={selectedSkill.userImage || "/default-avatar.png"}
                    alt={selectedSkill.userName}
                    className="w-20 h-20 rounded-full border border-white/20 object-cover"
                  />
                  <div>
                    <p className="text-lg font-medium text-white">
                      {selectedSkill.userName}
                    </p>
                    <p className="text-sm text-gray-300">
                      {selectedSkill.contactInfo?.email || "No Email"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-gray-300">
                  <p>
                    <span className="font-semibold text-white">Category:</span>{" "}
                    {selectedSkill.category || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Phone:</span>{" "}
                    {selectedSkill.contactInfo?.phone || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-white">Address:</span>{" "}
                    {selectedSkill.contactInfo?.address || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold text-white">
                      Visibility:
                    </span>{" "}
                    {selectedSkill.visibility
                      ? selectedSkill.visibility.charAt(0).toUpperCase() +
                        selectedSkill.visibility.slice(1)
                      : "N/A"}
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedSkill(null)}
                    className="px-5 py-2 rounded-lg border border-white/20 text-gray-300 hover:bg-red-500/30 hover:text-white transition-all shadow-none focus:outline-none"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
