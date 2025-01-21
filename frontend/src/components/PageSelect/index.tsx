interface PageSelectProps {
  value: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onValueChange: (newValue: number) => void;
}

function PageSelect({ value, onChange, onValueChange }: PageSelectProps) {
  return (
    <div>
      <button onClick={() => onValueChange(value - 1)}>{"<"}</button>
      <input value={value} onChange={onChange} />
      <button onClick={() => onValueChange(value + 1)}>{">"}</button>
    </div>
  );
}

export default PageSelect;
