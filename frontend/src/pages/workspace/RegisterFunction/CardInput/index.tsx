interface FunctionSelectProps {
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function CardInput({ value, onChange }: FunctionSelectProps) {
  return (
    <div>
      <input name="cardID" value={value} onChange={onChange} />
    </div>
  );
}

export default CardInput;
