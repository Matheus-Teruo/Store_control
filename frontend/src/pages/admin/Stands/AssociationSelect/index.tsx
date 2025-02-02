import { SummaryAssociation } from "@data/stands/Association";
import useAssociationService from "@service/stand/useAssociationService";
import { useEffect, useState } from "react";

interface AssociationSelectProps {
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

function AssociationSelect({ value, onChange }: AssociationSelectProps) {
  const [listAssociations, setListAssociations] = useState<
    SummaryAssociation[]
  >([]);
  const { getListAssociations } = useAssociationService();

  useEffect(() => {
    const fetchAssociation = async () => {
      const association = await getListAssociations();
      if (association) {
        setListAssociations(association);
      }
    };
    fetchAssociation();
  }, [getListAssociations]);

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
