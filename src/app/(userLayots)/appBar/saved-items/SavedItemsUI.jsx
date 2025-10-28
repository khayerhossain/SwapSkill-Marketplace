"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axiosInstance from "@/lib/axiosInstance";
import { Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import Loading from "@/app/loading";
import Container from "@/components/shared/Container";
import Swal from "sweetalert2";

export default function SavedItems() {
  const { data: session } = useSession();
  const [savedSkills, setSavedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSavedSkills = async () => {
      try {
        setLoading(true);
        setError("");

        const email = session?.user?.email;
        if (!email) return;

        const { data } = await axiosInstance.get("/saved-skills", {
          params: { email },
        });

        if (data.success) {
          setSavedSkills(data.savedSkills);
        } else {
          setError(data.message || "Failed to fetch saved skills.");
        }
      } catch (err) {
        console.error(err);
        setError(err.message || "Error loading saved skills.");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.email) fetchSavedSkills();
  }, [session]);

  const handleDelete = async (id) => {
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
          await axiosInstance.delete(`/saved-skills?id=${id}`);
          setSavedSkills((prev) =>
            prev.filter((s) => String(s._id) !== String(id))
          );
          Swal.fire("Deleted!", "Skill has been removed.", "success");
        } catch (error) {
          console.error("Delete failed:", error);
          Swal.fire("Error!", "Failed to delete skill.", "error");
        }
      }
    });
  };

  return (
    <section className="min-h-screen bg-[#0a0a0a] py-12">
      <Container>
        <h1 className="text-4xl font-extrabold mb-10 text-white drop-shadow-lg tracking-wide">
          My Saved Skills
        </h1>

        {loading && <Loading />}

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {!loading && savedSkills.length === 0 && (
          <p className="text-gray-500 text-center text-lg">
            You haven’t saved any skills yet.
          </p>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {savedSkills.map((skill) => (
            <div
              key={skill._id}
              className="backdrop-blur-md bg-[#1a1a1a]/80 border border-[#2c2c2c] p-6 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(0,0,0,0.7)] transition-transform transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={skill.userImage || "https://via.placeholder.com/60"}
                  alt={skill.userName}
                  className="w-14 h-14 rounded-full object-cover border border-[#333]"
                />
                <div>
                  <h2 className="font-semibold text-white">{skill.userName}</h2>
                  <p className="text-sm text-gray-400">
                    {skill.category || "Uncategorized"}
                  </p>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-5 leading-relaxed">
                {skill.description?.slice(0, 100) || "No description provided."}
              </p>

              <div className="flex gap-2">
                <Link
                  href={`/appBar/find-skills/${skill.saveId}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#111111] border border-[#2c2c2c] text-gray-200 px-4 py-2 rounded-xl font-medium hover:bg-[#1e1e1e] hover:border-[#444] hover:text-white transition"
                >
                  <Eye size={16} /> View
                </Link>
                <button
                  onClick={() => handleDelete(skill._id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#111111] border border-[#2c2c2c] text-gray-200 px-4 py-2 rounded-xl font-medium hover:bg-[#2a0f0f] hover:border-[#d33] hover:text-red-400 transition cursor-pointer"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
