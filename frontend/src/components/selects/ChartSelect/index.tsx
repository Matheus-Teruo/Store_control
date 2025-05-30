import styles from "./ChartSelect.module.scss";

interface ChartSelectProps {
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  list: string[];
}

function ChartSelect({ value, onChange, list }: ChartSelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event);
  };

  return (
    <select
      className={styles.select}
      id="chart"
      value={value}
      onChange={handleChange}
    >
      {list.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}

export default ChartSelect;
