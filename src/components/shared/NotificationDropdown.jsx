"use client";

import { useState, useRef, useEffect } from "react";
import { IoNotificationsOutline, IoNotifications } from "react-icons/io5";
import { useNotification } from "@/context/NotificationContext";

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

  // Close dropdown when clicking outside
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

  // Handle notification actions
  const handleAction = (notification, userChoice) => {
    handleNotificationAction(notification.id, userChoice);
    setIsOpen(false); // Close dropdown
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button
        onClick={handleToggleDropdown}
        className="btn btn-ghost btn-sm relative p-2"
      >
        {unreadCount > 0 ? (
          <IoNotifications className="text-xl text-red-500" />
        ) : (
          <IoNotificationsOutline className="text-xl" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 z-50 w-96 bg-white rounded-lg shadow-xl border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  {notification.type === "formSuccess" ? (
                    // Special notification with actions
                    <div
                      className={`p-4 ${
                        !notification.read ? "bg-yellow-50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            !notification.read
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          ⚠️
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            Do you want to start the Quiz?
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Choose your option!
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleAction(notification, "quiz")}
                          className="flex-1 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors text-sm"
                        >
                          Yes, go to Quiz!
                        </button>
                        <button
                          onClick={() => handleAction(notification, "findPage")}
                          className="flex-1 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors text-sm"
                        >
                          No, go to Find Page
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Normal notification
                    <div
                      className={`p-3 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            !notification.read ? "bg-blue-500" : "bg-gray-300"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <h4
                            className={`font-medium text-sm ${
                              !notification.read
                                ? "text-blue-800"
                                : "text-gray-800"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No notifications yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
