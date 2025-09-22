// contexts/NotificationContext.js (নতুন ফাইল তৈরি করুন)
"use client";

import { createContext, useContext, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// Context তৈরি করুন
const NotificationContext = createContext(undefined);

// Provider কম্পোনেন্ট
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  // নোটিফিকেশন যোগ করার ফাংশন
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      title: notification.title || "Notification",
      message: notification.message,
      time: new Date().toLocaleTimeString(),
      read: false,
      type: notification.type || "info",
      profileId: notification.profileId,
      userId: notification.userId,
      category: notification.category
    };
    
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  // নোটিফিকেশন read mark করার ফাংশন
  const markAsRead = useCallback((id) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  }, []);

  // সব নোটিফিকেশন read mark করার ফাংশন
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Unread count পাওয়ার ফাংশন
  const getUnreadCount = useCallback(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // নোটিফিকেশন action হ্যান্ডলার
  const handleNotificationAction = useCallback((notificationId, userChoice) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    // Mark as read
    markAsRead(notificationId);

    if (notification.type === "formSuccess") {
      if (userChoice === "quiz") {
        router.push(`/quiz?profileId=${notification.profileId}&userId=${notification.userId}&category=${notification.category}&showPopup=true`);
      } else {
        router.push("/find-skills");
      }
    }
  }, [notifications, markAsRead, router]);

  // Context value
  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    getUnreadCount,
    handleNotificationAction
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
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
};

export default NotificationContext;