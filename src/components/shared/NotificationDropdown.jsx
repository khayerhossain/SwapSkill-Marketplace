"use client";

import { useState, useRef, useEffect } from "react";
import { IoNotificationsOutline, IoNotifications } from "react-icons/io5";
import { useNotification } from "@/context/NotificationContext";
import { MdGames, MdWifiFind } from "react-icons/md";
import { FaBroom } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    handleNotificationAction,
  } = useNotification();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const unreadCount = getUnreadCount();

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (notification, userChoice) => {
    handleNotificationAction(notification.id, userChoice);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button
        onClick={handleToggleDropdown}
        className="relative p-4 rounded-2xl transition-all duration-300 hover:scale-105"
      >
        {unreadCount > 0 ? (
          <IoNotifications className="text-2xl text-blue-500" />
        ) : (
          <IoNotificationsOutline className="text-2xl text-gray-400" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-14 z-50 w-80 sm:w-96 bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <h3 className="font-bold flex items-center gap-2 text-white text-lg">
              <IoMdNotifications size={24} />
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-400 hover:text-blue-300 font-semibold px-3 py-1 rounded-full hover:bg-white/10 transition-all duration-200"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id} className="border-b border-white/5">
                  {/* Special Notification Type */}
                  {notification.type === "formSuccess" ? (
                    <div className="p-5 text-white">
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${
                            !notification.read
                              ? "bg-blue-500 text-white"
                              : "bg-white/20 text-gray-400"
                          }`}
                        >
                          <MdGames size={26} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">
                            Ready for the Quiz?
                          </h4>
                          <p className="text-gray-400 mt-1">
                            Choose your next step!
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 mt-4">
                        <button
                          onClick={() => handleAction(notification, "quiz")}
                          className="flex-1 flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-pink-600 to-red-500 text-white font-semibold rounded-2xl hover:opacity-90 transition-all"
                        >
                          <FaBroom size={22} />
                          Start Quiz
                        </button>
                        <button
                          onClick={() => handleAction(notification, "findPage")}
                          className="flex-1 flex justify-center items-center gap-2 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-2xl hover:opacity-90 transition-all"
                        >
                          <MdWifiFind size={22} />
                          Find Page
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Regular Notifications
                    <div
                      className={`p-5 transition-all duration-200 ${
                        !notification.read
                          ? "bg-white/10 hover:bg-white/20 border-l-4 border-blue-500"
                          : "hover:bg-white/10"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-3 h-3 rounded-full mt-3 ${
                            !notification.read
                              ? "bg-blue-500 animate-pulse"
                              : "bg-gray-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-semibold text-sm ${
                              !notification.read
                                ? "text-white"
                                : "text-gray-300"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-[10px] text-gray-500 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-400">
                <div className="text-5xl mb-2">📭</div>
                <p className="font-semibold text-lg">No notifications yet</p>
                <p className="text-sm mt-1 text-gray-500">
                  You're all caught up!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
