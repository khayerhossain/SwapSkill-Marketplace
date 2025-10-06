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
      <button
        onClick={handleToggleDropdown}
        className="relative p-4 rounded-2xl transition-all duration-300 transform hover:scale-105"
      >
        {unreadCount > 0 ? (
          <IoNotifications className="text-2xl text-blue-600" />
        ) : (
          <IoNotificationsOutline className="text-2xl text-gray-500" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-16 z-50 w-96 bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
          <div className="flex1 flex  items-center justify-between p-6  border-b-2 border-gray-100">
            <h3 className="font-bold flex items-center justify-center gap-2 text-gray-800 text-xl">
              <IoMdNotifications size={28} />
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold px-4 py-2 rounded-full hover:bg-blue-50 transition-all duration-200"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border-b border-gray-50 last:border-b-0"
                >
                  {notification.type === "formSuccess" ? (
                    <div
                      className={`p-6 ${
                        !notification.read ? "" : ""
                      }`}
                    >
                      <div className="flex items-start gap-4 mb-5">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${
                            !notification.read
                              ? "bg-blue-500 text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          <MdGames size={28} />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-800 text-lg">
                            Ready for the Quiz?
                          </h4>
                          <p className="text-gray-600 mt-1">
                            Choose your next step!
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-3 mt-5">
                        <button
                          onClick={() => handleAction(notification, "quiz")}
                          className="flex-1 flex justify-center items-center gap-2 py-4 bg-red-500 text-gray-700 font-semibold rounded-2xl hover:bg-blue-500 transition-all duration-200"
                        >
                          <FaBroom size={28} />
                          Start Quiz!
                        </button>
                        <button
                          onClick={() => handleAction(notification, "findPage")}
                          className="flex-1 flex justify-center items-center gap-2 py-4 bg-blue-500 text-gray-700 font-semibold rounded-2xl hover:bg- transition-all duration-200"
                        >
                          <MdWifiFind size={28} />
                          <span>Find Page</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`p-5 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                        !notification.read
                          ? "bg-blue-25 border-l-4 border-blue-400"
                          : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-3 h-3 rounded-full mt-3 flex-shrink-0 ${
                            !notification.read
                              ? "bg-blue-500 animate-pulse"
                              : "bg-gray-300"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-semibold ${
                              !notification.read
                                ? "text-gray-800"
                                : "text-gray-600"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-gray-500">
                <div className="text-6xl mb-4">📭</div>
                <p className="font-semibold text-lg">No notifications yet</p>
                <p className="text-sm mt-2">You're all caught up!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;