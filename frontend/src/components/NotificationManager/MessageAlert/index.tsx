import styles from "./MessageAlert.module.scss";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";

type MessageAlertProps = {
  id: number;
  title: string;
  message: string;
  type: MessageType;
};

function MessageAlert({ id, title, message, type }: MessageAlertProps) {
  const { removeNotification } = useAlertsContext();

  return (
    <div className={`${styles.frame} ${styles[type]}`}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.close} onClick={() => removeNotification(id)}>
          x
        </div>
      </div>
      <div className={styles.body}>{message}</div>
    </div>
  );
}

export default MessageAlert;
