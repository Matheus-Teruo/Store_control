import styles from "./Input.module.scss";
import { useState, useEffect } from "react";
import { InputStatus } from "./InputStatus";

interface InputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  exposeSetStatus?: (setStatus: (status: InputStatus) => void) => void;
  id: string;
  placeholder?: string;
  isSecret?: boolean;
  isRequired?: boolean;
  messages?: Array<string>;
}

function Input({
  value,
  onChange,
  id,
  exposeSetStatus,
  placeholder = "",
  isSecret = false,
  isRequired = false,
  messages = [],
}: InputProps) {
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
    <div className={styles.inputGroup}>
      <label htmlFor={id}>
        {status === InputStatus.Untouched ? (
          <div className={styles.iconInput} />
        ) : status === InputStatus.Accepted ? (
          <div className={styles.iconInput} />
        ) : (
          status === InputStatus.Rejected && (
            <div className={styles.iconInput} />
          )
        )}
      </label>
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        id={id}
        type={isSecret ? "password" : "text"}
        name={id}
        required={isRequired}
      />
      <div>
        <ul>
          {status === InputStatus.Rejected &&
            messages.map((message) => <li>{message}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default Input;
