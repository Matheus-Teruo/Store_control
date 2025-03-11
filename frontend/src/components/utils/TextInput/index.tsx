import { useEffect, useState } from "react";
import styles from "./TextInput.module.scss";
import { InputStatus } from "../InputStatus";

interface TextInputProps {
  value: string | number | undefined;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  id: string;
  placeholder?: string;
  rows?: number;
  isRequired?: boolean;
  showStatus?: boolean;
  message?: string;
}

function TextInput({
  value,
  onChange,
  id,
  placeholder = "",
  rows = 3,
  isRequired = false,
  showStatus = false,
  message = "",
}: TextInputProps) {
  const [status, setStatus] = useState<InputStatus>(InputStatus.Untouched);

  useEffect(() => {
    if (showStatus) {
      if (message === "") {
        setStatus(InputStatus.Accepted);
      } else {
        setStatus(InputStatus.Rejected);
      }
    }
  }, [showStatus, message]);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
      <textarea
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        rows={rows}
        id={id}
        name={id}
        required={isRequired}
      />
      {status !== InputStatus.Untouched && message && (
        <span className={styles.messageError}>{message}</span>
      )}
      {/* <ul>
        {status === InputStatus.Rejected &&
          messages.map((message) => <li>{message}</li>)}
      </ul> */}
    </div>
  );
}

export default TextInput;
