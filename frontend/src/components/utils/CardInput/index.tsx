import { useEffect, useState } from "react";
import { InputStatus } from "../InputStatus";
import styles from "./CardInput.module.scss";
import useCustomerService from "@service/customer/useCustomerService";

interface FunctionSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isRequired?: boolean;
  disabled?: boolean;
  showStatus?: boolean;
  message?: string;
  checkCard?: boolean;
  className?: string;
}

function CardInput({
  value,
  onChange,
  isRequired = false,
  disabled = false,
  showStatus = false,
  message = "",
  checkCard = false,
  className,
}: FunctionSelectProps) {
  const [status, setStatus] = useState<InputStatus>(InputStatus.Untouched);
  const { getCustomerByCard } = useCustomerService();

  useEffect(() => {
    if (showStatus) {
      if (message === "") {
        setStatus(InputStatus.Accepted);
      } else {
        setStatus(InputStatus.Rejected);
      }
    }
  }, [showStatus, message]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length <= 15) onChange(event);
    if (checkCard && event.target.value.length === 15) {
      const customerResponse = await getCustomerByCard(event.target.value);
      if (customerResponse) {
        console.log("Valido");
        setStatus(InputStatus.Accepted);
      } else {
        console.log("Inválido");
        setStatus(InputStatus.Rejected);
      }
    } else {
      setStatus(InputStatus.Untouched);
    }
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
