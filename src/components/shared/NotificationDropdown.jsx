"use client";

import { useState } from "react";
import { IoNotificationsOutline, IoNotifications } from "react-icons/io5";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true); // Mock data - replace with real notification state

  // Mock notifications data - replace with real data from your API/context
  const notifications = [
    {
      id: 1,
      title: "New skill request",
      message: "Someone requested your JavaScript skills",
      time: "2 minutes ago",
      read: false,
    },
    {
      id: 2,
      title: "Skill exchange approved",
      message: "Your Python skill exchange has been approved",
      time: "1 hour ago",
      read: true,
    },
    {
      id: 3,
      title: "New message",
      message: "You have a new message from John Doe",
      time: "3 hours ago",
      read: false,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      {/* Notification Button */}
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-sm relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          {hasNotifications && unreadCount > 0 ? (
            <IoNotifications className="text-xl" />
          ) : (
            <IoNotificationsOutline className="text-xl" />
          )}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-error text-error-content text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Notification Dropdown */}
        {isOpen && (
          <div
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-80 border border-base-300"
          >
            <div className="flex items-center justify-between p-2 border-b border-base-300">
              <h3 className="font-semibold">Notifications</h3>
              <button
                className="btn btn-ghost btn-xs"
                onClick={() => setHasNotifications(false)}
              >
                Mark all read
              </button>
            </div>
            
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-base-200 hover:bg-base-200 cursor-pointer ${
                      !notification.read ? "bg-base-200/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        !notification.read ? "bg-primary" : "bg-transparent"
                      }`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-xs text-base-content/70 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-base-content/50 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-base-content/50">
                  No notifications
                </div>
              )}
            </div>
            
            <div className="p-2 border-t border-base-300">
              <button className="btn btn-ghost btn-sm w-full">
                View all notifications
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
