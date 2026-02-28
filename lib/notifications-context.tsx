"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  MOCK_NOTIFICATIONS,
  generateNotificationId,
  type Notification,
  type NotificationCategory,
  type TargetRole,
} from "./notifications-data";

type FilterValue = "all" | "unread" | NotificationCategory;

interface NotificationsContextValue {
  notifications: Notification[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  createNotification: (payload: {
    title: string;
    description: string;
    targetRole: TargetRole;
    redirectLink?: string;
    category: NotificationCategory;
  }) => void;
  filterNotifications: (filter: FilterValue) => Notification[];
}

const NotificationsContext = createContext<NotificationsContextValue | null>(
  null
);

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>(() =>
    MOCK_NOTIFICATIONS.map((n) => ({ ...n }))
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const createNotification = useCallback(
    (payload: {
      title: string;
      description: string;
      targetRole: TargetRole;
      redirectLink?: string;
      category: NotificationCategory;
    }) => {
      const iconMap: Record<NotificationCategory, NotificationCategory> = {
        orders: "orders",
        returns: "returns",
        withdraw: "withdraw",
        system: "system",
      };
      const newNotif: Notification = {
        id: generateNotificationId(),
        icon: iconMap[payload.category],
        title: payload.title,
        description: payload.description,
        relatedUser: "Admin",
        timestamp: new Date().toISOString(),
        read: false,
        category: payload.category,
        redirectLink: payload.redirectLink,
        targetRole: payload.targetRole,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    },
    []
  );

  const filterNotifications = useCallback(
    (filter: FilterValue): Notification[] => {
      let list = [...notifications];
      if (filter === "unread") {
        list = list.filter((n) => !n.read);
      } else if (filter !== "all") {
        list = list.filter((n) => n.category === filter);
      }
      return list.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    },
    [notifications]
  );

  const value = useMemo(
    () => ({
      notifications,
      markAsRead,
      markAllAsRead,
      createNotification,
      filterNotifications,
    }),
    [
      notifications,
      markAsRead,
      markAllAsRead,
      createNotification,
      filterNotifications,
    ]
  );

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error("useNotifications must be used within NotificationsProvider");
  }
  return ctx;
}
