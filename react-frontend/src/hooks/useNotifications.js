import { useEffect, useState } from "react";
import {
  notificationStorageKeys,
  sampleNotifications,
} from "../data/notifications";

function loadNotifications(role) {
  const storageKey = notificationStorageKeys[role];

  try {
    const savedNotifications = localStorage.getItem(storageKey);
    if (savedNotifications !== null) {
      const parsedNotifications = JSON.parse(savedNotifications);
      if (Array.isArray(parsedNotifications)) {
        return parsedNotifications.filter(
          (notification) => notification.role === role
        );
      }
      console.error(`Saved ${role} notifications must be an array.`);
    }
  } catch (error) {
    console.error(`Unable to load ${role} notifications from localStorage.`, error);
  }

  return sampleNotifications[role].map((notification) => ({ ...notification }));
}

export function useNotifications(role) {
  const [notifications, setNotifications] = useState(() =>
    loadNotifications(role)
  );

  // Persist changes so read state survives navigation and browser refreshes.
  useEffect(() => {
    try {
      localStorage.setItem(
        notificationStorageKeys[role],
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error(`Unable to save ${role} notifications to localStorage.`, error);
    }
  }, [notifications, role]);

  const markAsRead = (notificationId) => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) =>
        notification.read ? notification : { ...notification, read: true }
      )
    );
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  };
}
