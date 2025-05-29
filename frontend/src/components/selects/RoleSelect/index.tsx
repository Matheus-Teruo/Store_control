import styles from "./RoleSelect.module.scss";
import { VoluntaryRole } from "@data/volunteers/Voluntary";
import { VoluntaryRoleMetadata } from "./voluntaryRoleMetadata";

interface RoleSelectProps {
  value: VoluntaryRole;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  message?: string;
}

function RoleSelect({ value, onChange, message = "" }: RoleSelectProps) {
  return (
    <div className={styles.base}>
      <select
        className={styles.select}
        id="roles"
        value={value}
        onChange={onChange}
      >
        {Object.entries(VoluntaryRoleMetadata).map(([key, { label }]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
      {message && <span className={styles.messageError}>{message}</span>}
    </div>
  );
}

export default RoleSelect;
