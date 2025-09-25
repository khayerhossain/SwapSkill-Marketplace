"use client";
import axiosInstance from "@/lib/axiosInstance";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { CheckCircle, XCircle, MessageSquare, Trash2 } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/users");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
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
          setUsers((prev) =>
            prev.filter((u) => String(u._id) !== String(id))
          );
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

  return (
    <div>
      <section className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-8 text-center">All Users</h1>

        {/* Table screens for md and up */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                <th className="px-4 py-2 md:px-6 md:py-3 text-sm font-semibold text-center">
                  Name
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-sm font-semibold text-center">
                  Email
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-sm font-semibold text-center">
                  Status
                </th>
                <th className="px-4 py-2 md:px-6 md:py-3 text-sm font-semibold text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`hover:bg-orange-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-2 md:px-6 md:py-4 text-center font-medium text-gray-700">
                    {user.name}
                  </td>
                  <td className="px-4 py-2 md:px-6 md:py-4 text-center text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 md:px-6 md:py-4 text-center">
                    <button
                      onClick={() => handleStatusToggle(user._id, user.status)}
                      className=" cursor-pointer flex items-center justify-center gap-2 px-2 md:px-3 py-1 rounded-lg shadow-sm border transition hover:bg-gray-100 mx-auto text-sm"
                    >
                      {user.status === "active" ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" /> Active
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-red-600" /> Deactive
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-2 md:px-6 md:py-4 text-center flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => handleMessage(user)}
                      className="bg-blue-500 cursor-pointer text-white px-2 md:px-3 py-1 md:py-2 rounded-lg shadow hover:bg-blue-600 transition text-xs md:text-sm flex items-center gap-1"
                    >
                      <MessageSquare className="w-4 h-4" /> Message
                    </button>
                    <button
                      onClick={() => handleRemove(user._id)}
                      className="bg-red-500 cursor-pointer text-white px-2 md:px-3 py-1 md:py-2 rounded-lg shadow hover:bg-red-600 transition text-xs md:text-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    No users found...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card for small screens */}
        <div className="md:hidden space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="border rounded-xl p-4 shadow-sm bg-gray-50"
            >
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-gray-600 text-sm">{user.email}</p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleStatusToggle(user._id, user.status)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg shadow-sm border transition hover:bg-gray-100 text-sm "
                >
                  {user.status === "active" ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" /> Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-600" /> Deactive
                    </>
                  )}
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMessage(user)}
                    className="bg-blue-500 text-white px-2 py-1 rounded-lg shadow hover:bg-blue-600 transition text-xs flex items-center gap-1 "
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemove(user._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded-lg shadow hover:bg-red-600 transition text-xs flex items-center gap-1 "
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-center text-gray-500 italic">No users found...</p>
          )}
        </div>
      </section>
    </div>
  );
}
