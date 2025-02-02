import SummaryFunction from "@data/volunteers/Function";
import useFunctionService from "@service/voluntary/useFunctionsService";
import { useEffect, useState } from "react";

interface FunctionSelectProps {
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function FunctionSelect({ value, onChange }: FunctionSelectProps) {
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
    <div>
      {/* <label htmlFor="functions"></label> TODO: trocar para svg */}
      <select id="functions" value={value} onChange={onChange}>
        <option value={undefined}></option>
        {listFunctions.map((voluntaryFunction) => (
          <option key={voluntaryFunction.uuid} value={voluntaryFunction.uuid}>
            {voluntaryFunction.functionName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FunctionSelect;
