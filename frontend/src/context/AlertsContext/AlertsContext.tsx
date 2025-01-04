import React, { useState } from "react";
import { Message, Notification, AlertsContext } from "./useUserContext";

export default function AlertProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: Message): void => {
    setNotifications((prev) => {
      const newNotification: Notification = {
        id: Date.now(),
        message: message,
      };
      return [newNotification, ...prev];
    });
  };

  const removeNotification = (id: number): void => {
    const newNotifications = notifications.filter(
      (notification) => notification.id !== id,
    );
    setNotifications(newNotifications);
  };

  return (
    <AlertsContext.Provider
      value={{ notifications, addNotification, removeNotification }}
    >
      {children}
    </AlertsContext.Provider>
  );
}
