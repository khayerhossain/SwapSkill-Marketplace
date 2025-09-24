"use client";

import Sidebar from "@/components/shared/SideBar";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import { signOut, useSession } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";
import Link from "next/link";
import NotificationDropdown from "@/components/shared/NotificationDropdown";

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();

  return (
      <div className="min-h-screen bg-base-100 text-base-content">
        <div className="flex">
          {/* Large Screen Sidebar - Fixed Position */}
          <div className={`hidden md:block fixed left-0 top-0 h-screen z-30 ${collapsed ? "w-[6rem]" : "w-[20%]"} bg-base-200 text-base-content border-r border-base-300`}>
            <div className="p-4 border-b border-base-300 flex items-center justify-between">
              <h1 className="text-xl font-bold">Swap Skill</h1>
              <button
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="btn btn-ghost btn-xs"
                onClick={() => setCollapsed(!collapsed)}
              >
                {collapsed ? <IoIosArrowForward /> : <IoIosArrowBack />}
              </button>
            </div>
            <Sidebar collapsed={collapsed} isDashboard={true} />
          </div>

          {/* Main Content */}
          <div className={`w-full ${collapsed ? "md:ml-[6rem]" : "md:ml-[20%]"}`}>
            <div className="flex items-center justify-end gap-3 p-4 border-b border-base-300">
              {session?.user && <NotificationDropdown />}
              {session?.user && (
                <Link href="/dashboard/profile" className="px-3 py-2 rounded-full bg-base-200 text-base-content font-medium">
                  {session.user.name || "Profile"}
                </Link>
              )}
              


              {session?.user && (
                <button
                  aria-label="Logout"
                  onClick={() => signOut()}
                  className="btn btn-ghost btn-sm text-error"
                  title="Logout"
                >
                  <FiLogOut />
                </button>
              )}
            </div>
            {children}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 p-3 text-2xl text-base-content bg-base-200 rounded-md md:hidden z-50"
        >
          <IoMdMenu />
        </button>

        {/* Drawer for Mobile */}
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-base-content/50 z-40"
              onClick={() => setIsOpen(false)}
            ></div>

            {/* Sidebar Drawer */}
            <div
              className={`fixed top-0 left-0 h-full w-72 bg-base-200 text-base-content shadow-lg transform transition-transform duration-300 z-50
              ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
              <div className="flex justify-between items-center p-4 border-b border-base-300">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-2xl text-base-content"
                >
                  <IoMdClose />
                </button>
              </div>
              <Sidebar collapsed={false} onClick={() => setIsOpen(false)} />
            </div>
          </>
        )}
      </div>
  );
}
