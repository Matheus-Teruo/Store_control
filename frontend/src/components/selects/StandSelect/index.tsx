import styles from "./StandSelect.module.scss";
import { SummaryStand } from "@data/stands/Stand";
import { useEffect, useState } from "react";
import useStandService from "@service/stand/useStandService";

interface StandSelectProps {
  value: string | undefined;
  onChange: (event: string | undefined) => void;
  mode?: "select" | "radio";
}

function StandSelect({ value, onChange, mode = "select" }: StandSelectProps) {
  const [listStands, setListStands] = useState<SummaryStand[]>([]);
  const { getListStands } = useStandService();

  useEffect(() => {
    const fetchStand = async () => {
      const stands = await getListStands();
      if (stands) setListStands(stands);
    };
    fetchStand();
  }, [getListStands]);

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  const handleChangeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(value === event.target.value ? undefined : event.target.value);
  };

  return (
    <>
      {mode === "select" ? (
        <div className={styles.background}>
          {/* <label htmlFor="stands"></label> TODO: trocar para svg */}
          <select id="stands" value={value} onChange={handleChangeSelect}>
            <option value={undefined}></option>
            {listStands.map((stand) => (
              <option key={stand.uuid} value={stand.uuid}>
                {stand.standName}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <ul className={styles.checkBackground}>
          {listStands.map((stand) => (
            <label
              key={stand.uuid}
              className={`${stand.uuid === value && styles.selected}`}
            >
              <input
                type="checkbox"
                name="stands"
                value={stand.uuid}
                checked={value === stand.uuid}
                onChange={handleChangeCheck}
              />
              <span>{stand.standName}</span>
            </label>
          ))}
        </ul>
      )}
    </>
  );
}

export default StandSelect;
