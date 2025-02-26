import { useEffect, useState } from "react";
import styles from "./ProductInput.module.scss";
import { InputStatus } from "./InputStatus";

interface ProductInputProps {
  value: string | number | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  exposeSetStatus?: (setStatus: (status: InputStatus) => void) => void;
  id: string;
  type?: string;
  placeholder?: string;
  maxLength?: number;
  isRequired?: boolean;
  message?: string;
}

function ProductInput({
  value,
  onChange,
  id,
  exposeSetStatus,
  type = "text",
  placeholder = "",
  maxLength,
  isRequired = false,
  message = "",
}: ProductInputProps) {
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
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        id={id}
        name={id}
        type={type}
        required={isRequired}
        maxLength={maxLength}
      />
      {message && <span className={styles.messageError}>{message}</span>}
      {/* <ul>
        {status === InputStatus.Rejected &&
          messages.map((message) => <li>{message}</li>)}
      </ul> */}
    </div>
  );
}

export default ProductInput;
