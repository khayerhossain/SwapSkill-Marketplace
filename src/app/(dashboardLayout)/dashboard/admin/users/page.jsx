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
        <h1 className="text-3xl font-bold mb-8 text-left">All Users</h1>

        {/* Table screens for md and up */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg shadow-sm overflow-hidden">

            <thead className="border-b-2 border-gray-200">

            <tr className="bg-gray-100">

               <th className="px-4 py-2 md:px-6 md:py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 text-center uppercase tracking-wide">
             Profile
            </th>

            <th className="px-4 py-2 md:px-6 md:py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 text-center uppercase tracking-wide">
             Name
            </th>
             <th className="px-4 py-2 md:px-6 md:py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 text-center uppercase tracking-wide">
             Email
            </th>
            <th className="px-4 py-2 md:px-6 md:py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 text-center uppercase tracking-wide">
             Status
            </th>
            <th className="px-4 py-2 md:px-6 md:py-3 text-sm font-semibold text-blue-600 dark:text-blue-400 text-center uppercase tracking-wide">
           Action
          </th>
         </tr>
         </thead>

            <tbody className="divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className={` transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >

                <td className="px-4 py-2 md:px-6 md:py-4 text-center">
                 <img
                   src={user.photo || " No Photo "}
                   alt={user.name}
                   className="w-10 h-10 rounded-full mx-auto object-cover border"
                  />
                 </td>

                  <td className="px-4 py-2 md:px-6 md:py-4 text-center font-medium text-gray-700">
                    {user.name}
                  </td>
                  <td className="px-4 py-2 md:px-6 md:py-4 text-center text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 md:px-6 md:py-4 text-center">
                 <button
               onClick={() => handleStatusToggle(user._id, user.status)}
             className={`flex cursor-pointer items-center justify-center gap-2 px-4 py-1.5 rounded-full font-medium text-sm shadow-md transition duration-200 mx-auto
                  ${
               user.status === "active"
                ? "bg-green-100 text-green-700 border border-green-300 hover:bg-green-200"
              : "bg-red-100 text-red-700 border border-red-300 hover:bg-red-200"
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
                  <td className="px-4 py-2 md:px-6 md:py-4 text-center flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => handleMessage(user)}
                      className="bg-blue-500 cursor-pointer text-white px-2 md:px-3 py-1 md:py-2 rounded-lg shadow hover:bg-blue-600 transition text-xs md:text-sm flex items-center gap-1"
                    >
                      <MessageSquare className="w-4 h-4" /> 
                    </button>
                    <button
                      onClick={() => handleRemove(user._id)}
                      className="bg-red-500 cursor-pointer text-white px-2 md:px-3 py-1 md:py-2 rounded-lg shadow hover:bg-red-600 transition text-xs md:text-sm flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> 
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

              <div className="flex items-center gap-3">
              <img
               src={user.photo || "/default-avatar.png"}
               alt={user.name}
               className="w-12 h-12 rounded-full object-cover border"
               />
               <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-gray-600 text-sm">{user.email}</p>
                 </div>
               </div>
               
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