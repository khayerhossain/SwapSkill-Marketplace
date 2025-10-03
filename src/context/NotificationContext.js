// contexts/NotificationContext.js 
"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
// import { useRouter } from "next/auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Create context
const NotificationContext = createContext(undefined);

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();

  // Socket connection for real-time notifications
  useEffect(() => {
    if (!session?.user?.id) return;

    // Dynamic import for socket.io-client to avoid SSR issues
    import('socket.io-client').then((module) => {
      const io = module.default;
      const newSocket = io(process.env.NEXTAUTH_URL || 'http://localhost:3000');
      
      newSocket.on('connect', () => {
        console.log("Connected to socket for notifications");
        newSocket.emit('join_user', session.user.id);
      });

      // Listen for real-time notifications
      newSocket.on('new_notification', (notification) => {
        console.log("Real-time notification received:", notification);
        
        // Add new notification to state
        const newNotification = {
          _id: notification.notificationId || Date.now().toString(),
          title: notification.title,
          message: notification.message,
          type: notification.type,
          chatId: notification.chatId,
          read: false,
          createdAt: new Date(notification.createdAt)
        };

        setNotifications(prev => [newNotification, ...prev]);
      });

      setSocket(newSocket);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [session?.user?.id]);

  // Function to add a new notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      _id: Date.now() + Math.random(),
      title: notification.title || "Notification",
      message: notification.message,
      time: new Date().toLocaleTimeString(),
      read: false,
      type: notification.type || "info",
      profileId: notification.profileId,
      userId: notification.userId,
      category: notification.category,
      chatId: notification.chatId,
      createdAt: new Date()
    };

    setNotifications((prev) => [newNotification, ...prev]);
  }, []);

  // Function to mark a notification as read
  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification._id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  // Function to mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  }, []);

  // Function to get unread notification count
  const getUnreadCount = useCallback(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Handle notification actions
  const handleNotificationAction = useCallback(
    (notificationId, userChoice) => {
      const notification = notifications.find((n) => n._id === notificationId);
      if (!notification) return;

      // Mark as read
      markAsRead(notificationId);

      if (notification.type === "formSuccess") {
        if (userChoice === "quiz") {
          router.push(
            `/quiz?profileId=${notification.profileId}&userId=${notification.userId}&category=${notification.category}&showPopup=true`
          );
        } else {
          router.push("/appBar/find-skills");
        }
      } else if (notification.type === "chat") {
        // Handle chat notification
        if (notification.chatId) {
          router.push(`/chat/${notification.chatId}`);
        }
      }
    },
    [notifications, markAsRead, router]
  );

  // Context value
  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    handleNotificationAction,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook
export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }

  return context;
};

export default NotificationContext;