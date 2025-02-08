import styles from "./MessageAlert.module.scss";
import {
  MessageType,
  useAlertsContext,
} from "@context/AlertsContext/useAlertsContext";

type MessageAlertProps = {
  id: number;
  title: string;
  message: string;
  fields?: Record<string, string>;
  type: MessageType;
};

function MessageAlert({ id, title, message, fields, type }: MessageAlertProps) {
  const { removeNotification } = useAlertsContext();
  return (
    <div className={`${styles.frame} ${styles[type]}`}>
      <div className={styles.header}>
        <div className={styles.title}>{title}</div>
        <div className={styles.close} onClick={() => removeNotification(id)}>
          x
        </div>
      </div>
      <div className={styles.body}>
        <p>{message}</p>
        {fields && (
          <ul>
            {Object.entries(fields).map(([field, message]) => (
              <li key={field}>
                <p>{message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MessageAlert;
