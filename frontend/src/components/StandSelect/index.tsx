import styles from "./StandSelect.module.scss";
import { SummaryStand } from "@data/stands/Stand";
import { useEffect, useState } from "react";
import useStandService from "@service/stand/useStandService";

interface StandSelectProps {
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function StandSelect({ value, onChange }: StandSelectProps) {
  const [listStands, setListStands] = useState<SummaryStand[]>([]);
  const { getListStands } = useStandService();

  useEffect(() => {
    const fetchStand = async () => {
      const stands = await getListStands();
      if (stands) setListStands(stands);
    };
    fetchStand();
  }, [getListStands]);

  return (
    <div className={styles.background}>
      {/* <label htmlFor="stands"></label> TODO: trocar para svg */}
      <select id="stands" value={value} onChange={onChange}>
        <option value={undefined}></option>
        {listStands.map((stand) => (
          <option key={stand.uuid} value={stand.uuid}>
            {stand.standName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default StandSelect;
