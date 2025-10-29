"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Swal from "sweetalert2";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/subscribers");
      if (res.data.success) setSubscribers(res.data.subscribers);
    } catch (err) {
      console.error("Error fetching subscribers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action can’t be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, remove it!",
      background: "#111",
      color: "#fff",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosInstance.delete("/api/subscribers", { data: { id } });
        setSubscribers((prev) => prev.filter((s) => s._id !== id));
        Swal.fire({
          title: "Removed!",
          text: "Subscriber has been deleted.",
          icon: "success",
          background: "#111",
          color: "#fff",
        });
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Something went wrong.",
          icon: "error",
          background: "#111",
          color: "#fff",
        });
        console.error("Error removing subscriber:", err);
      }
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0e0e0e] to-[#151515] p-6 flex flex-col items-center">
      <div className="w-full rounded-2xl shadow-2xl p-6 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">
          Newsletter{" "}
          <span className="text-red-500 drop-shadow-lg">Subscribers</span>
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm md:text-base">
              <thead>
                <tr className="bg-white/10 text-gray-200 uppercase text-xs tracking-wider">
                  <th className="p-4 text-left">Image</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {subscribers.length > 0 ? (
                  subscribers.map((sub, idx) => (
                    <tr
                      key={sub._id}
                      className={`${
                        idx % 2 === 0 ? "bg-white/5" : "bg-white/10"
                      } hover:bg-white/20 transition-all duration-200`}
                    >
                      <td className="p-4">
                        <img
                          src={sub.image || "https://i.pravatar.cc/100"}
                          alt="avatar"
                          className="w-10 h-10 rounded-full object-cover border border-white/20"
                        />
                      </td>
                      <td className="p-4 font-medium text-gray-100">
                        {sub.name || "Anonymous"}
                      </td>
                      <td className="p-4 text-gray-400">{sub.email}</td>
                      <td className="p-4 text-gray-500">
                        {sub.createdAt
                          ? new Date(sub.createdAt).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleRemove(sub._id)}
                          className="px-5 py-2 text-sm rounded-lg font-semibold bg-white/10 hover:bg-red-600 hover:text-white border border-white/10 transition-all duration-200"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="p-8 text-center text-gray-500 italic"
                    >
                      No subscribers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
