import { useContext, createContext } from "react";

export enum MessageType {
  OK = "ok",
  INFO = "information",
  WARNING = "warning",
  ERROR = "error",
}

export interface Message {
  title: string;
  message: string;
  fields?: Record<string, string>;
  type: MessageType;
}

export interface Notification {
  id: number;
  message: Message;
}

interface AlertContextType {
  notifications: Notification[];
  addNotification: (message: Message) => void;
  removeNotification: (id: number) => void;
}

export const AlertsContext = createContext<AlertContextType | undefined>(
  undefined,
);

export const useAlertsContext = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
