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

  // Delete saved skill
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
          console.log("Deleting skill with id:", id);
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
    <section>
      <Container>
        <h1 className="text-3xl font-bold mb-6 text-center text-white pt-6 ">My Saved Skills</h1>

        {loading && <Loading />}

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        {!loading && savedSkills.length === 0 && (
          <p className="text-gray-500 text-center">
            You haven’t saved any skills yet.
          </p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {savedSkills.map((skill) => (
            <div
              key={skill._id}
              className="bg-white border p-5 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={skill.userImage || "https://via.placeholder.com/60"}
                  alt={skill.userName}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-semibold">{skill.userName}</h2>
                  <p className="text-sm text-gray-500">
                    {skill.category || "Uncategorized"}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-3">
                {skill.description?.slice(0, 100) || "No description"}
              </p>

              <div className="flex gap-2">
                <Link
                  href={`/appBar/find-skills/${skill._id}`}
                  className="flex-1 flex items-center justify-center gap-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
                >
                  <Eye size={16} /> View
                </Link>
                <button
                  onClick={() => handleDelete(skill._id)}
                  className="flex-1 flex items-center justify-center gap-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm"
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
