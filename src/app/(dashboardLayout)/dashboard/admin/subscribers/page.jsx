"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSubscribers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/subscribers");
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
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete("/api/subscribers", { data: { id } });

        setSubscribers((prev) => prev.filter((s) => s._id !== id));

        Swal.fire("Removed!", "Subscriber has been removed.", "success");
      } catch (err) {
        Swal.fire("Error!", "Something went wrong.", "error");
        console.error("Error removing subscriber:", err);
      }
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Newsletter Subscribers
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub, idx) => (
                <tr
                  key={sub._id}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-gray-100 transition`}
                >
                  <td className="p-3">
                    <img
                      src={sub.image || "https://i.pravatar.cc/100"}
                      alt="avatar"
                      className="w-10 h-10 rounded-full border"
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-800">
                    {sub.name || "Anonymous"}
                  </td>
                  <td className="p-3 text-gray-600">{sub.email}</td>
                  <td className="p-3 text-gray-500">
                    {sub.createdAt
                      ? new Date(sub.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleRemove(sub._id)}
                      className="px-4 py-1.5 text-sm rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500 italic"
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
  );
}