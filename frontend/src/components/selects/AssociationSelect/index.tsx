import styles from "./AssociationSelect.module.scss";
import { SummaryAssociation } from "@data/stands/Association";
import useAssociationService from "@service/stand/useAssociationService";
import { useEffect, useState } from "react";

interface AssociationSelectProps {
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  message?: string;
}

function AssociationSelect({
  value,
  onChange,
  message = "",
}: AssociationSelectProps) {
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
    <div className={styles.base}>
      <select
        className={styles.select}
        id="associations"
        value={value}
        onChange={onChange}
      >
        <option value="" disabled style={{ color: "#656360" }}>
          {" "}
          -- association --
        </option>
        {listAssociations.map((association) => (
          <option key={association.uuid} value={association.uuid}>
            {association.associationName}
          </option>
        ))}
      </select>
      {message && <span className={styles.messageError}>{message}</span>}
    </div>
  );
}

export default AssociationSelect;
