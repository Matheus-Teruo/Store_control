import { useHandleApiError } from "@/axios/handlerApiError";
import SummaryFunction from "@data/volunteers/Function";
import { getListFunctions } from "@service/voluntary/functionsService";
import { useEffect, useState } from "react";

interface FunctionSelectProps {
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function FunctionSelect({ value, onChange }: FunctionSelectProps) {
  const [listFunctions, setListFunctions] = useState<SummaryFunction[]>([]);
  const handleApiError = useHandleApiError();

  useEffect(() => {
    const fetchAssociation = async () => {
      try {
        const voluntaryFunctions = await getListFunctions();
        setListFunctions(voluntaryFunctions);
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchAssociation();
  }, [handleApiError]);

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
