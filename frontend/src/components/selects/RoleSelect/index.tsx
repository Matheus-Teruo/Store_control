import styles from "./RoleSelect.module.scss";
import { VoluntaryRole } from "@data/volunteers/Voluntary";

interface RoleSelectProps {
  value: VoluntaryRole;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  message?: string;
}

const VoluntaryRoleMetadata: Record<VoluntaryRole, { label: string }> = {
  [VoluntaryRole.VOLUNTARY]: { label: "Voluntario" },
  [VoluntaryRole.MANAGEMENT]: { label: "Gerente" },
  [VoluntaryRole.ADMIN]: { label: "Administrador" },
};

function RoleSelect({ value, onChange, message = "" }: RoleSelectProps) {
  return (
    <div className={styles.base}>
      <select
        className={styles.select}
        id="roles"
        value={value}
        onChange={onChange}
      >
        <option value={undefined}></option>
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
