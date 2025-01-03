import styles from "./OptionsFilter.module.scss";
import { SummaryStand } from "@data/stands/Stand";
import { useEffect, useState } from "react";

interface OptionsFilterProps {
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const standsExample: SummaryStand[] = [
  { uuid: "55d399ed-a527-4f81-bcd6-8964b6100094", standName: "stand 1" },
  { uuid: "1242d199-8ee1-4c5c-80bb-36c9c7faaab2", standName: "stand 2" },
];

function OptionsFilter({ value, onChange }: OptionsFilterProps) {
  const [listStands, setListStands] = useState<SummaryStand[]>([]);

  useEffect(() => {
    // Simula valores do backend
    setTimeout(() => {
      setListStands(standsExample);
    }, 1000);
  }, []);

  return (
    <div className={styles.background}>
      {/* <label htmlFor="stands"></label> */}
      <select id="stands" value={value} onChange={onChange}>
        <option value={undefined}>sem filtro</option>
        {listStands.map((stand) => (
          <option key={stand.uuid} value={stand.uuid}>
            {stand.standName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default OptionsFilter;
