import { PaymentMetadata } from "./paymentMetadata";
import styles from "./PaymentSelect.module.scss";
import { PaymentType } from "@data/operations/Recharge";

type SelectPaymentProps = {
  payment: PaymentType;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function PaymentSelect({ payment, onChange }: SelectPaymentProps) {
  return (
    <ul className={styles.radio}>
      {Object.entries(PaymentMetadata).map(([key, { pt }]) => (
        <label key={key} className={`${key === payment && styles.selected}`}>
          <input
            type="radio"
            name="paymentOption"
            value={key}
            checked={payment === key}
            onChange={onChange}
          />
          <span>{pt}</span>
        </label>
      ))}
    </ul>
  );
}

export default PaymentSelect;
