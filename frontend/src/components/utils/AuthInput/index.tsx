import styles from "./AuthInput.module.scss";
import { useState, useEffect } from "react";
import { InputStatus } from "./InputStatus";

interface AuthInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  exposeSetStatus?: (setStatus: (status: InputStatus) => void) => void;
  id: string;
  placeholder?: string;
  isSecret?: boolean;
  isRequired?: boolean;
  ComponentUntouched?: React.ComponentType;
  ComponentAccepted?: React.ComponentType;
  ComponentRejected?: React.ComponentType;
  message?: string;
}

function AuthInput({
  value,
  onChange,
  id,
  exposeSetStatus,
  placeholder = "",
  isSecret = false,
  isRequired = false,
  ComponentUntouched,
  ComponentAccepted,
  ComponentRejected,
  message = "",
}: AuthInputProps) {
  const [status, setStatus] = useState<InputStatus>(InputStatus.Untouched);

  useEffect(() => {
    if (exposeSetStatus) {
      exposeSetStatus(setStatus);
    }
  }, [exposeSetStatus]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    setStatus(InputStatus.Untouched);
  };

  return (
    <div
      className={`${styles.inputGroup}
      ${
        status === InputStatus.Accepted
          ? styles.unfocOK
          : status === InputStatus.Rejected && styles.unfocNO
      }`}
    >
      {status === InputStatus.Untouched
        ? ComponentUntouched && (
            <label htmlFor={id} className={styles.iconInput}>
              <ComponentUntouched />
            </label>
          )
        : status === InputStatus.Accepted
          ? ComponentAccepted && (
              <label htmlFor={id} className={styles.iconInput}>
                <ComponentAccepted />
              </label>
            )
          : status === InputStatus.Rejected &&
            ComponentRejected && (
              <label htmlFor={id} className={styles.iconInput}>
                <ComponentRejected />
              </label>
            )}
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        id={id}
        type={isSecret ? "password" : "text"}
        name={id}
        required={isRequired}
      />
      {message && <span className={styles.messageError}>{message}</span>}
      {/* <ul>
        {status === InputStatus.Rejected &&
          messages.map((message) => <li>{message}</li>)}
      </ul> */}
    </div>
  );
}

export default AuthInput;
