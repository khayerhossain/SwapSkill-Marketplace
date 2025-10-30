"use client";
import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { CheckCircle, XCircle, MessageSquare, Trash2 } from "lucide-react";
import Loading from "@/app/loading";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/users");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "deactive" : "active";
    try {
      await axiosInstance.patch("/users", { id, status: newStatus });

      setUsers((prev) =>
        prev.map((u) =>
          String(u._id) === String(id) ? { ...u, status: newStatus } : u
        )
      );
    } catch (error) {
      Swal.fire("Error!", "Failed to update status.", "error");
    }
  };

  const handleRemove = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/users?id=${id}`);
          setUsers((prev) => prev.filter((u) => String(u._id) !== String(id)));
          Swal.fire("Deleted!", "User has been removed.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete user.", "error");
        }
      }
    });
  };

  const handleMessage = (user) => {
    Swal.fire({
      title: `Send message to ${user.name}?`,
      input: "text",
      inputPlaceholder: "Type your message here...",
      showCancelButton: true,
      confirmButtonText: "Send",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire("Sent!", `Message sent to ${user.email}`, "success");
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <section className="mx-auto bg-transparent rounded-2xl">
        <h1 className="text-3xl font-bold mb-8 text-left text-gray-200">
          All <span className="text-red-500">Users</span>
        </h1>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto rounded-xl backdrop-blur-xl bg-[#0a0a0a]/70 border border-white/10 shadow-sm">
          <table className="w-full rounded-lg overflow-hidden text-gray-200">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase text-center">
                  Profile
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase text-center">
                  Name
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase text-center">
                  Email
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase text-center">
                  Status
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`transition ${
                    index % 2 === 0 ? "bg-white/5" : "bg-white/10"
                  }`}
                >
                  <td className="px-6 py-4 text-center">
                    <img
                      src={user.photo || "/default-avatar.png"}
                      alt={user.name}
                      className="w-10 h-10 rounded-full mx-auto object-cover border border-white/20"
                    />
                  </td>
                  <td className="px-6 py-4 text-center font-medium">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleStatusToggle(user._id, user.status)}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition cursor-pointer shadow-none focus:outline-none ${
                        user.status === "active"
                          ? "bg-green-900/40 text-green-300 hover:bg-green-900/60"
                          : "bg-red-900/40 text-red-300 hover:bg-red-900/60"
                      }`}
                    >
                      {user.status === "active" ? (
                        <>
                          <CheckCircle className="w-4 h-4" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" /> Deactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleMessage(user)}
                        className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1"
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemove(user._id)}
                        className="bg-red-700 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-10 text-gray-400 italic"
                  >
                    No users found...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="border rounded-xl p-4 shadow-md bg-white hover:shadow-lg transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.photo || "/default-avatar.png"}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                />
                <div>
                  <p className="font-semibold text-gray-800">{user.name}</p>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleStatusToggle(user._id, user.status)}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg font-medium text-sm ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status === "active" ? (
                    <>
                      <CheckCircle className="w-4 h-4" /> Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" /> Deactive
                    </>
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleMessage(user)}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemove(user._id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-center text-gray-500 italic">
              No users found...
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
