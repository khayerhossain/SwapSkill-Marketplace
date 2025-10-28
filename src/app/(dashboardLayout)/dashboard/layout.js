"use client";

import Sidebar from "@/components/shared/SideBar";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import { signOut, useSession } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";
import Link from "next/link";
import NotificationDropdown from "@/components/shared/NotificationDropdown";
import Image from "next/image";
import Chatbot from "@/app/(landingArea)/chatbot/chat";

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-gray-200 overflow-x-hidden flex">
      {/* Sidebar for large devices */}
      <div
        className={`hidden md:flex fixed left-0 top-0 h-screen z-30 flex-col bg-[#111111] border-r border-gray-800 transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <Link href="/" className="text-xl font-bold text-red-500">
            {!collapsed ? "SwapSkill" : "SS"}
          </Link>
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-2 text-gray-400 hover:text-red-500 rounded-md transition-colors"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <IoIosArrowForward /> : <IoIosArrowBack />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <Sidebar
          collapsed={collapsed}
          isDashboard={true}
          role={session?.user?.role || "user"}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 w-full ${
          collapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        {/* Top Bar */}
        <header className="flex items-center justify-between p-3 py-1 border-b border-gray-800 bg-[#111111] sticky top-0 z-40">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-2xl bg-[#222222] text-gray-200 rounded-md md:hidden hover:bg-red-600 transition-colors"
            aria-label="Open Menu"
          >
            <IoMdMenu />
          </button>

          {/* Right side items */}
          <div className="flex items-center gap-4 ml-auto">
            {session?.user && <NotificationDropdown />}

            {/* Profile */}
            {session?.user && (
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-800 text-gray-200 hover:bg-gray-900 transition-colors"
              >
                <Image
                  src={session.user.image || "/default-profile.png"}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <span className="hidden lg:block font-medium">
                  {session.user.name || "Profile"}
                </span>
              </Link>
            )}

            {/* Logout Button */}
            {session?.user && (
              <button
                aria-label="Logout"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-2 text-gray-300 hover:text-white cursor-pointer hover:bg-gray-900 rounded-full transition-colors"
              >
                <FiLogOut size={20} />
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4">{children}</main>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Drawer Sidebar */}
          <div className="fixed top-0 left-0 h-full w-72 bg-[#111111] text-gray-200 shadow-lg z-50 md:hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-800">
              <h1 className="text-xl font-bold text-red-500">Dashboard</h1>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl text-gray-400 hover:text-red-500"
              >
                <IoMdClose />
              </button>
            </div>

            <Sidebar
              collapsed={false}
              onClick={() => setIsOpen(false)}
              isDashboard={true}
              role={session?.user?.role || "user"}
            />
          </div>
        </>
      )}
      <Chatbot />
    </div>
  );
}
