import styles from "./StandSelect.module.scss";
import { SummaryStand } from "@data/stands/Stand";
import { useEffect, useState } from "react";
import useStandService from "@service/stand/useStandService";
import { InputStatus } from "@/components/utils/InputStatus";

interface StandSelectProps {
  value: string | undefined;
  onChange: (event: string | undefined) => void;
  mode?: "select" | "radio";
  notNull?: boolean;
  showStatus?: boolean;
  message?: string;
}

function StandSelect({
  value,
  onChange,
  mode = "select",
  notNull = false,
  showStatus = false,
  message = "",
}: StandSelectProps) {
  const [listStands, setListStands] = useState<SummaryStand[]>([]);
  const [status, setStatus] = useState<InputStatus>(InputStatus.Untouched);
  const { getListStands } = useStandService();

  useEffect(() => {
    const fetchStand = async () => {
      const stands = await getListStands();
      if (stands) setListStands(stands);
    };
    fetchStand();
  }, [getListStands]);

  useEffect(() => {
    if (showStatus) {
      if (message === "") {
        setStatus(InputStatus.Accepted);
      } else {
        setStatus(InputStatus.Rejected);
      }
    }
  }, [showStatus, message]);

  const handleChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
    setStatus(InputStatus.Untouched);
  };

  const handleChangeCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(value === event.target.value ? undefined : event.target.value);
  };

  return (
    <>
      {mode === "select" ? (
        <div
          className={`${styles.base}
          ${
            status === InputStatus.Accepted
              ? styles.unfocOK
              : status === InputStatus.Rejected && styles.unfocNO
          }`}
        >
          <select
            className={styles.select}
            id="stands"
            value={value}
            onChange={handleChangeSelect}
          >
            <option value="" disabled={notNull} style={{ color: "#656360" }}>
              -- estande --
            </option>
            {listStands.map((stand) => (
              <option key={stand.uuid} value={stand.uuid}>
                {stand.standName}
              </option>
            ))}
          </select>
          {status !== InputStatus.Untouched && message && (
            <span className={styles.messageError}>{message}</span>
          )}
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
