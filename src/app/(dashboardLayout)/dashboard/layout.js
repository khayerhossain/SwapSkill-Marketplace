"use client";

import Sidebar from "@/components/shared/SideBar";
import { useState } from "react";
import { IoMdClose, IoMdMenu } from "react-icons/io";

export default function DashboardLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
      <div className="min-h-screen">
        <div className="flex">
          {/* Large Screen Sidebar */}
          <div className="hidden md:block w-[20%] bg-gray-800 text-white">
            <div className="p-4 border-b border-gray-700">
              <h1 className="text-xl font-bold">Dashboard</h1>
            </div>
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="w-full md:w-[80%] md:ml-8">{children}</div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 p-3 text-2xl text-white bg-gray-800 rounded-md md:hidden z-50"
        >
          <IoMdMenu />
        </button>

        {/* Drawer for Mobile */}
        {isOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            ></div>

            {/* Sidebar Drawer */}
            <div
              className={`fixed top-0 left-0 h-full w-72 bg-gray-900 text-white shadow-lg transform transition-transform duration-300 z-50
              ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-2xl text-white"
                >
                  <IoMdClose />
                </button>
              </div>
              <Sidebar onClick={() => setIsOpen(false)} />
            </div>
          </>
        )}
      </div>
  );
}
