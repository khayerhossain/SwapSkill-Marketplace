"use client";

import Sidebar from "@/components/shared/SideBar";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { signOut, useSession } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import NotificationDropdown from "@/components/shared/NotificationDropdown";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import Image from "next/image";

export default function AppBarLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-base-content overflow-x-hidden flex">
      {/* Large Screen Sidebar */}
      <div
        className={`hidden md:flex fixed top-0 left-0 h-screen z-30 flex-col bg-[#111111] text-gray-200 border-r border-gray-800 transition-width duration-300 ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
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
        <Sidebar
          useAppBarPaths
          collapsed={collapsed}
          isDashboard={false}
          role={session?.user?.role || "user"}
        />
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 w-full ${
          collapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        {/* AppBar */}
        <header className="flex items-center justify-between p-1 border-b border-gray-800 bg-[#111111] text-gray-200 w-full z-40 shadow-sm sticky top-0">
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 text-2xl bg-[#222222] text-gray-200 rounded-md md:hidden hover:bg-red-500 transition-colors"
              aria-label="Open Menu"
            >
              <IoMdMenu />
            </button>
            <h1 className="text-xl font-bold text-red-500">App Bar</h1>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              href="appBar/leader-board"
              className="text-gray-200 hover:text-red-500 transition-colors flex-shrink-0"
            >
              <ClipboardList size={20} />
            </Link>

            <NotificationDropdown />

            {session?.user && (
              <Link
                href="/dashboard/profile"
                className="flex items-center gap-2 px-2 py-1 rounded-full bg-gray-800 text-gray-200  transition-colors flex-shrink-0"
              >
                <Image
                  src={session.user.image}
                  alt={session.user.name || "Profile"}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
                <span className="hidden lg:block">
                  {session.user.name || "Profile"}
                </span>
              </Link>
            )}

            {session?.user && (
              <button
                aria-label="Logout"
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="p-2 text-gray-200 hover:text-white hover:bg-red-500 rounded-full transition-colors flex-shrink-0 cursor-pointer"
              >
                <FiLogOut size={20} />
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 w-full">{children}</main>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
          {/* Drawer */}
          <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 md:hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-800">Menu</h1>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl text-gray-600 hover:text-gray-800"
                aria-label="Close Menu"
              >
                <IoMdClose />
              </button>
            </div>
            <Sidebar
              useAppBarPaths
              collapsed={false}
              onClick={() => setIsOpen(false)}
              isDashboard={false}
              role={session?.user?.role || "user"}
            />
          </div>
        </>
      )}
    </div>
  );
}
