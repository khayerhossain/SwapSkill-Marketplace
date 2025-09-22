"use client";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
  };

  const handleStatusChange = async (id, newStatus) => {
    await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });

    setUsers((prev) =>
      prev.map((u) =>
        String(u._id) === String(id) ? { ...u, status: newStatus } : u
      )
    );
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
        const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });

        if (res.ok) {
          setUsers((prev) => prev.filter((u) => String(u._id) !== String(id)));
          Swal.fire("Deleted!", "User has been removed.", "success");
        } else {
          Swal.fire("Error!", "Failed to delete user.", "error");
        }
      }
    });
  };

  return (
    <div>
      <section className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-8 text-center">All Users</h1>

        {/* medium & large screens show table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-orange-500 to-pink-500 text-white">
                <th className="px-6 py-3 text-sm font-semibold text-center">Name</th>
                <th className="px-6 py-3 text-sm font-semibold text-center">Email</th>
                <th className="px-6 py-3 text-sm font-semibold text-center">Status</th>
                <th className="px-6 py-3 text-sm font-semibold text-center">Action</th>
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
                  <td className="px-6 py-4 text-center font-medium text-gray-700">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <select
                      value={user.status || "active"}
                      onChange={(e) => handleStatusChange(user._id, e.target.value)}
                      className="p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none cursor-pointer"
                    >
                      <option value="active">✅ Active</option>
                      <option value="deactive">❌ Deactive</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleRemove(user._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition cursor-pointer"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500 italic">
                    No users found...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* small screens show card */}
        <div className="md:hidden space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="border rounded-xl p-4 shadow-sm bg-gray-50"
            >
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-gray-600 text-sm">{user.email}</p>
              <div className="flex justify-between items-center mt-4">
                <select
                  value={user.status || "active"}
                  onChange={(e) => handleStatusChange(user._id, e.target.value)}
                  className="p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm"
                >
                  <option value="active">✅ Active</option>
                  <option value="deactive">❌ Deactive</option>
                </select>
                <button
                  onClick={() => handleRemove(user._id)}
                  className="bg-red-500 text-white px-3 py-2 rounded-lg shadow hover:bg-red-600 transition text-sm"
                >
                  Remove
                </button>
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
