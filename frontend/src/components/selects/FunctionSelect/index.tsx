import activeConfig from "@/config/activeConfig";
import styles from "./FunctionSelect.module.scss";
import SummaryFunction from "@data/volunteers/Function";
import useFunctionService from "@service/voluntary/useFunctionsService";
import { useEffect, useState } from "react";

interface FunctionSelectProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  message?: string;
}

function FunctionSelect({
  value,
  onChange,
  message = "",
}: FunctionSelectProps) {
  const [listFunctions, setListFunctions] = useState<SummaryFunction[]>([]);
  const { getListFunctions } = useFunctionService();

  useEffect(() => {
    const fetchAssociation = async () => {
      const voluntaryFunctions = await getListFunctions();
      if (voluntaryFunctions) {
        if (activeConfig.version === "simple") {
          const filteredFunctions = voluntaryFunctions.filter(
            (item) => item.uuid !== "12345678-abcd-4efa-bcde-f1234567890a",
          );
          setListFunctions(filteredFunctions);
        } else {
          setListFunctions(voluntaryFunctions);
        }
      }
    };

    fetchAssociation();
  }, [getListFunctions]);

  return (
    <div className={styles.base}>
      <select
        className={styles.select}
        id="functions"
        value={value}
        onChange={onChange}
      >
        {listFunctions.map((voluntaryFunction) => (
          <option key={voluntaryFunction.uuid} value={voluntaryFunction.uuid}>
            {voluntaryFunction.functionName}
          </option>
        ))}
      </select>
      {message && <span className={styles.messageError}>{message}</span>}
    </div>
  );
}

export default FunctionSelect;
