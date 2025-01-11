import { useHandleApiError } from "@/axios/handlerApiError";
import styles from "./OptionsFilter.module.scss";
import { SummaryStand } from "@data/stands/Stand";
import { useEffect, useState } from "react";
import { getListStands } from "@service/stand/standService";

interface OptionsFilterProps {
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function OptionsFilter({ value, onChange }: OptionsFilterProps) {
  const [listStands, setListStands] = useState<SummaryStand[]>([]);
  const handleApiError = useHandleApiError();

  useEffect(() => {
    const fetchStand = async () => {
      try {
        const stands = await getListStands();
        setListStands(stands);
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchStand();
  }, [handleApiError]);

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

export default OptionsFilter;
