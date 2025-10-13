"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";
import { Eye, EyeOff, Trash2, Info } from "lucide-react";
import { MdOutlinePendingActions } from "react-icons/md";

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
      await axiosInstance.patch("/current-skills", { id, visibility: newVisibility });
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
    const matchesSearch = s.userName?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || s.visibility === filter;
    return matchesSearch && matchesFilter;
  });

  //  Loader
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  //  mt-12
  return (
    <section className="max-w-6xl mx-auto  p-6 sm:p-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8 text-left dark:text-white">
        All Current Skills
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Skills
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {skills.length}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <MdOutlinePendingActions className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Hidden
              </p>
              <p className="text-2xl font-bold text-yellow-600">
                {skills.filter((a) => a.visibility === "hide").length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <EyeOff className="text-yellow-600 text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Showing
              </p>
              <p className="text-2xl font-bold text-green-600">
                {skills.filter((a) => a.visibility === "showing").length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Eye className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

            {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="w-full text-left">
          <thead className=" border-b-2 border-gray-200">


            <tr>
              <th className="px-6 py-4 text-sm font-semibold  text-blue-600 dark:text-blue-400  text-center">Image</th>
              <th className="px-14 py-4 text-sm font-semibold text-blue-600 dark:text-blue-400">User</th>
              <th className="px-10 py-4 text-sm font-semibold text-blue-600 dark:text-blue-400">Category</th>
              <th className="px-6 py-4 text-sm font-semibold text-blue-600 dark:text-blue-400 text-center">Visibility</th>
              <th className="px-6 py-4 text-sm font-semibold text-blue-600 dark:text-blue-400 text-center">Actions</th>
            </tr>


          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSkills.map((skill, index) => (
              <tr
                key={skill._id}
                className={`${
                  index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                }  transition`}
              >
                <td className="px-6 py-4 text-center align-middle">
                  <img
                    src={skill.userImage || "/default-avatar.png"}
                    alt={skill.userName}
                    className="w-14 h-14 rounded-full object-cover border border-gray-300 mx-auto"
                  />
                </td>
                <td className="px-6 py-4 align-middle">
                  <p className="font-medium text-gray-800 dark:text-gray-200">{skill.userName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{skill.contactInfo.email || "No email"}</p>
                </td>
                <td className="px-6 py-4 text-gray-700 dark:text-gray-300 align-middle">
                  {skill.category || "N/A"}
                </td>
                <td className="px-6 py-4 text-center align-middle ">
                  <button
                    onClick={() => handleVisibilityToggle(skill._id, skill.visibility)}
                    className={`cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full font-medium text-sm shadow-sm transition ${
                      skill.visibility === "showing"
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {skill.visibility === "showing" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    
                  </button>
                </td>
                <td className="px-6 py-4 text-center align-middle">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setSelectedSkill(skill)}
                      className="bg-blue-500 cursor-pointer text-white px-2 md:px-3 py-1 md:py-2 rounded-lg shadow hover:bg-blue-600 transition text-xs md:text-sm flex items-center gap-1"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleRemove(skill._id)}
                      className="bg-red-500 cursor-pointer text-white px-2 md:px-3 py-1 md:py-2 rounded-lg shadow hover:bg-red-600 transition text-xs md:text-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredSkills.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-10 text-gray-500 dark:text-gray-400 italic">
                  No skills found...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile / Tablet Card Layout */}
      <div className="lg:hidden space-y-4">
        {filteredSkills.map((skill) => (
          <div
            key={skill._id}
            className="border rounded-xl p-4 shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center gap-4">
              <img
                src={skill.userImage || "/default-avatar.png"}
                alt={skill.userName}
                className="w-14 h-14 rounded-full object-cover border border-gray-300"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800 dark:text-gray-200">{skill.userName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{skill.contactInfo.email || "No email"}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Category: {skill.category || "N/A"}</p>
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
                {skill.visibility === "showing" ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedSkill(skill)}
                  className="bg-blue-500 text-white px-4 py-1 rounded-lg shadow hover:bg-blue-600 transition text-sm"
                >
                  <Info className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleRemove(skill._id)}
                  className="bg-red-500 text-white px-4 py-1 rounded-lg shadow hover:bg-red-600 transition text-sm flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredSkills.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 italic py-6">No skills found...</p>
        )}
      </div>

      {/* Modal for Details */}
      {selectedSkill && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg p-6 rounded-xl shadow-2xl relative animate-fadeIn">
            <button
              onClick={() => setSelectedSkill(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white cursor-pointer"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-indigo-400">Skill Details</h3>
            <div className="flex items-center gap-4 mb-4">
              <img
                src={selectedSkill.userImage || "/default-avatar.png"}
                alt={selectedSkill.userName}
                className="w-20 h-20 rounded-full border object-cover"
              />
              <div>
                <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{selectedSkill.userName}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedSkill.contactInfo?.email || "No Email"}
                </p>
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Category:</span> {selectedSkill.category || "N/A"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Phone:</span> {selectedSkill.contactInfo?.phone || "N/A"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Address:</span> {selectedSkill.contactInfo?.address || "N/A"}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Visibility:</span>{" "}
              {selectedSkill.visibility
                ? selectedSkill.visibility.charAt(0).toUpperCase() + selectedSkill.visibility.slice(1)
                : "N/A"}
            </p>
          </div>
        </div>
      )} 


    </section>
  );
}
