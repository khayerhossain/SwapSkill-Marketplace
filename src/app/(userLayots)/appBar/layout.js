// components/shared/Navbar.js
"use client";

import Link from "next/link";
import Sidebar from "@/components/shared/SideBar";
import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { signOut, useSession } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";
import { IoMdClose, IoMdMenu } from "react-icons/io";
import NotificationDropdown from "@/components/shared/NotificationDropdown";


export default function AppBarLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-base-100 text-base-content overflow-x-hidden">
      <div className="flex">
        {/* Large Screen Sidebar */}
        <div className={`hidden md:block fixed left-0 top-0 h-screen z-30 ${collapsed ? "w-[6rem]" : "w-[20%]"} bg-base-200 text-base-content border-r border-base-300`}>
          <div className="p-4 flex items-center justify-between">
            <span className="font-semibold">Swap Skill</span>
            <button
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="btn btn-ghost btn-xs"
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <IoIosArrowForward /> : <IoIosArrowBack />}
            </button>
          </div>
          <Sidebar useAppBarPaths collapsed={collapsed} isDashboard={false} />
        </div>

        {/* Main Content */}
        <div className={`w-full ${collapsed ? "md:pl-[6rem]" : "md:pl-[20%]"} pr-2`}>
          <header className="flex items-center justify-between p-4 border-b border-base-300 bg-white sticky top-0 z-40">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-2xl text-base-content bg-base-200 rounded-md md:hidden"
                aria-label="Open Menu"
              >
                <IoMdMenu />
              </button>
              <h1 className="text-xl font-bold text-gray-800">App Bar</h1>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Notification Dropdown */}
               <NotificationDropdown />
              
              {/* User Profile */}
              {session?.user && (
                <Link 
                  href="/dashboard/profile" 
                  className="px-4 py-2 rounded-full bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition-colors"
                >
                  {session.user.name || "Profile"}
                </Link>
              )}
              
              {/* Logout Button */}
              {session?.user && (
                <button
                  aria-label="Logout"
                  onClick={() => signOut()}
                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Logout"
                >
                  <FiLogOut className="text-lg" />
                </button>
              )}
            </div>
          </header>
          
          <main className="w-full">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* Sidebar Drawer */}
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
            />
          </div>
        </>
      )}
    </div>
  );
}