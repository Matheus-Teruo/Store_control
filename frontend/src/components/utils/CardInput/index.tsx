import { useEffect, useState } from "react";
import { InputStatus } from "../InputStatus";
import styles from "./CardInput.module.scss";
interface FunctionSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isRequired?: boolean;
  disabled?: boolean;
  showStatus?: boolean;
  message?: string;
  className?: string;
}

function CardInput({
  value,
  onChange,
  isRequired = false,
  disabled = false,
  showStatus = false,
  message = "",
  className,
}: FunctionSelectProps) {
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
      }
      ${value.length === 15 && styles.validValue} ${className}`}
    >
      <input
        value={value}
        onChange={handleChange}
        placeholder="ID do Cartão"
        id="cardId"
        name="cardId"
        required={isRequired}
        disabled={disabled}
        maxLength={15}
      />
    </div>
  );
}

export default CardInput;
