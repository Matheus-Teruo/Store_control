import { useHandleApiError } from "@/axios/handlerApiError";
import { SummaryAssociation } from "@data/stands/Association";
import { getListAssociations } from "@service/stand/associationService";
import { useEffect, useState } from "react";

interface AssociationSelectProps {
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function AssociationSelect({ value, onChange }: AssociationSelectProps) {
  const [listAssociations, setListAssociations] = useState<
    SummaryAssociation[]
  >([]);
  const handleApiError = useHandleApiError();

  useEffect(() => {
    const fetchAssociation = async () => {
      try {
        const association = await getListAssociations();
        setListAssociations(association);
      } catch (error) {
        handleApiError(error);
      }
    };
    fetchAssociation();
  }, [handleApiError]);

  return (
    <div>
      {/* <label htmlFor="associations"></label> TODO: trocar para svg */}
      <select id="associations" value={value} onChange={onChange}>
        <option value={undefined}></option>
        {listAssociations.map((association) => (
          <option key={association.uuid} value={association.uuid}>
            {association.associationName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default AssociationSelect;
