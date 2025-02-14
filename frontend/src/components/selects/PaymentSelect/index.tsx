import { PaymentType } from "@data/operations/Recharge";

type SelectPaymentProps = {
  payment: PaymentType;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const PaymentRoleMetadata: Record<PaymentType, { label: string }> = {
  [PaymentType.CASH]: { label: "Dinheiro" },
  [PaymentType.DEBIT]: { label: "Débito" },
  [PaymentType.CREDIT]: { label: "Crédito" },
};

function PaymentSelect({ payment, onChange }: SelectPaymentProps) {
  return (
    <ul>
      {Object.entries(PaymentRoleMetadata).map(([key, { label }]) => (
        <label key={key}>
          <input
            type="radio"
            name="paymentOption"
            value={key}
            checked={payment === key}
            onChange={onChange}
          />
          <span>{label}</span>
        </label>
      ))}
    </ul>
  );
}

export default PaymentSelect;
