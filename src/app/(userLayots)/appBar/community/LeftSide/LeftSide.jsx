"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LeftSide() {
  const { data: session } = useSession();
  const router = useRouter();

  const shortcuts = [
    { name: "Art and Drawing", icon: "🎨" },
    { name: "Dribbble Pro", icon: "🏀" },
    { name: "Behance Creative", icon: "🎭" },
    { name: "One Piece Fan", icon: "🏴‍☠" },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md p-6 text-center">
        <img
          src={
            session?.user?.image
              ? session.user.image
              : "https://i.pravatar.cc/100?img=12"
          }
          alt={session?.user?.name || "Profile"}
          className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-gray-200 shadow"
        />
        <h2 className="text-xl font-bold text-gray-800">
          {session?.user?.name || "Guest User"}
        </h2>
        <p className="text-sm text-gray-500">
          {session?.user?.email || "guest@example.com"}
        </p>

        <div className="flex justify-around mt-5 text-sm text-gray-700">
          <div className="text-center">
            <p className="font-bold text-lg">250</p>
            <span className="text-gray-500">Posts</span>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">2022</p>
            <span className="text-gray-500">Followers</span>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg">590</p>
            <span className="text-gray-500">Following</span>
          </div>
        </div>

        {/* ✅ My Profile Button */}
        <button
          onClick={() => router.push("/appBar/profile")}
          className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          My Profile
        </button>
      </div>

      {/* Shortcuts */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="font-semibold mb-4 text-gray-800">Your Shortcuts</h3>
        <ul className="space-y-3">
          {shortcuts.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-gray-700 cursor-pointer hover:text-blue-500 transition"
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}