"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div className="relative">
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary text-primary-content rounded-full flex items-center justify-center text-xs font-semibold">
              {session.user.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <span className="hidden sm:inline">{session.user.name || "User"}</span>
          </div>
        </div>

        {isOpen && (
          <div
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300"
          >
            <div className="p-3 border-b border-base-300">
              <p className="font-semibold text-sm">{session.user.name || "User"}</p>
              <p className="text-xs text-base-content/70">{session.user.email}</p>
            </div>
            
            <ul className="menu menu-sm">
              <li>
                <Link 
                  href="/dashboard/profile" 
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser className="text-sm" />
                  Profile
                </Link>
              </li>
              <li>
                <Link 
                  href="/dashboard/settings" 
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FaCog className="text-sm" />
                  Settings
                </Link>
              </li>
              <li>
                <button
                  className="flex items-center gap-2 text-error"
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                >
                  <FaSignOutAlt className="text-sm" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;
