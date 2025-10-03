// @/components/shared/NotificationDropdown;
"use client";

import { useState, useRef, useEffect } from "react";
import { IoNotificationsOutline, IoNotifications } from "react-icons/io5";
import { MdGames, MdWifiFind, MdMessage } from "react-icons/md";
import { FaBroom } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const { data: session } = useSession();

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

  // Fetch notifications from API
  useEffect(() => {
    if (session?.user?.id && isOpen) {
      fetchNotifications();
    }
  }, [session?.user?.id, isOpen]);

  const fetchNotifications = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/notifications?userId=${session.user.id}`);
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(notification =>
            notification._id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!session?.user?.id) return;
    
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          markAll: true, 
          userId: session.user.id 
        }),
      });

      if (response.ok) {
        // Update all notifications to read in local state
        setNotifications(prev =>
          prev.map(notification => ({ ...notification, read: true }))
        );
      }
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getUnreadCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  const handleNotificationAction = async (notificationId, userChoice) => {
    const notification = notifications.find((n) => n._id === notificationId);
    if (!notification) return;

    // Mark as read
    await markAsRead(notificationId);

    if (notification.type === "formSuccess") {
      if (userChoice === "quiz") {
        router.push(
          `/quiz?profileId=${notification.profileId}&userId=${notification.userId}&category=${notification.category}&showPopup=true`
        );
      } else {
        router.push("/appBar/find-skills");
      }
    }
  };

  const handleChatNotification = (notification) => {
    // Navigate to chat page when clicking on chat notification
    if (notification.chatId) {
      router.push(`/chat/${notification.chatId}`);
    }
    markAsRead(notification._id);
    setIsOpen(false);
  };

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return notificationTime.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "chat":
        return <MdMessage size={20} className="text-green-600" />;
      case "formSuccess":
        return <MdGames size={20} className="text-blue-600" />;
      default:
        return <IoMdNotifications size={20} className="text-gray-600" />;
    }
  };

  const getNotificationBackground = (type, isRead) => {
    if (!isRead) {
      switch (type) {
        case "chat":
          return "bg-green-50 border-l-4 border-green-400";
        case "formSuccess":
          return "bg-blue-50 border-l-4 border-blue-400";
        default:
          return "bg-blue-25 border-l-4 border-blue-400";
      }
    }
    return "";
  };

  const unreadCount = getUnreadCount();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggleDropdown}
        className="relative p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:bg-gray-100"
      >
        {unreadCount > 0 ? (
          <IoNotifications className="text-2xl text-blue-600" />
        ) : (
          <IoNotificationsOutline className="text-2xl text-gray-500" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-16 z-50 w-96 bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white border-b-2 border-gray-100">
            <h3 className="font-bold flex items-center justify-center gap-2 text-gray-800 text-xl">
              <IoMdNotifications size={28} />
              Notifications
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold px-4 py-2 rounded-full hover:bg-blue-50 transition-all duration-200"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Loading notifications...</p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="border-b border-gray-50 last:border-b-0"
                >
                  {notification.type === "formSuccess" ? (
                    <div
                      className={`p-6 ${
                        !notification.read ? "bg-blue-50" : ""
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
                          onClick={() => handleNotificationAction(notification._id, "quiz")}
                          className="flex-1 flex justify-center items-center gap-2 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-200"
                        >
                          <FaBroom size={28} />
                          Start Quiz!
                        </button>
                        <button
                          onClick={() => handleNotificationAction(notification._id, "findPage")}
                          className="flex-1 flex justify-center items-center gap-2 py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-all duration-200"
                        >
                          <MdWifiFind size={28} />
                          <span>Find Page</span>
                        </button>
                      </div>
                    </div>
                  ) : notification.type === "chat" ? (
                    <div
                      className={`p-5 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${getNotificationBackground(
                        notification.type,
                        notification.read
                      )}`}
                      onClick={() => handleChatNotification(notification)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4
                              className={`font-semibold ${
                                !notification.read
                                  ? "text-gray-800"
                                  : "text-gray-600"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`p-5 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${getNotificationBackground(
                        notification.type,
                        notification.read
                      )}`}
                      onClick={() => markAsRead(notification._id)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4
                              className={`font-semibold ${
                                !notification.read
                                  ? "text-gray-800"
                                  : "text-gray-600"
                              }`}
                            >
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatTime(notification.createdAt)}
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

          {notifications.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => router.push('/notifications')}
                className="w-full text-center text-blue-600 hover:text-blue-800 font-medium py-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
              >
                View All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;