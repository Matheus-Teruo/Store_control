import styles from "./FunctionSelect.module.scss";
import SummaryFunction from "@data/volunteers/Function";
import useFunctionService from "@service/voluntary/useFunctionsService";
import { useEffect, useState } from "react";

interface FunctionSelectProps {
  value: string | undefined;
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
        setListFunctions(voluntaryFunctions);
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
        <option value={undefined}></option>
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
