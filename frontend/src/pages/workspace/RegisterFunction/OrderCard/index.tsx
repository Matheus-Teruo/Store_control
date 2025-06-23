interface FunctionSelectProps {
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function OrderCard({ value, onChange }: FunctionSelectProps) {
  return (
    <div>
      <input name="orderCardID" value={value} onChange={onChange} />
    </div>
  );
}

export default OrderCard;
