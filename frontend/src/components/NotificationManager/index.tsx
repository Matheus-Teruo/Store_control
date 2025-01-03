import styles from "./NotificationManager.module.scss";
import MessageAlert from "./MessageAlert";
import { useAlertsContext } from "@/context/AlertsContext/useUserContext";

function NotificationManager() {
  const { notifications } = useAlertsContext();

  return (
    <div className={styles.container}>
      {notifications.slice(0, 3).map((notification) => (
        <MessageAlert
          key={notification.id}
          id={notification.id}
          {...notification.message}
        />
      ))}
    </div>
  );
}

export default NotificationManager;
