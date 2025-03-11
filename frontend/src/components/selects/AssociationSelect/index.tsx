import styles from "./AssociationSelect.module.scss";
import { InputStatus } from "@/components/utils/InputStatus";
import { SummaryAssociation } from "@data/stands/Association";
import useAssociationService from "@service/stand/useAssociationService";
import { useEffect, useState } from "react";

interface AssociationSelectProps {
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  showStatus?: boolean;
  message?: string;
}

function AssociationSelect({
  value,
  onChange,
  showStatus = false,
  message = "",
}: AssociationSelectProps) {
  const [listAssociations, setListAssociations] = useState<
    SummaryAssociation[]
  >([]);
  const [status, setStatus] = useState<InputStatus>(InputStatus.Untouched);
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

  useEffect(() => {
    if (showStatus) {
      if (message === "") {
        setStatus(InputStatus.Accepted);
      } else {
        setStatus(InputStatus.Rejected);
      }
    }
  }, [showStatus, message]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event);
    setStatus(InputStatus.Untouched);
  };

  return (
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
        id="associations"
        value={value}
        onChange={handleChange}
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
      {status !== InputStatus.Untouched && message && (
        <span className={styles.messageError}>{message}</span>
      )}
    </div>
  );
}

export default AssociationSelect;
