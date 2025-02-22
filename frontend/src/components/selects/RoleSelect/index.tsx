import styles from "./RoleSelect.module.scss";
import { VoluntaryRole } from "@data/volunteers/Voluntary";

interface RoleSelectProps {
  value: VoluntaryRole;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const VoluntaryRoleMetadata: Record<VoluntaryRole, { label: string }> = {
  [VoluntaryRole.VOLUNTARY]: { label: "Voluntario" },
  [VoluntaryRole.MANAGEMENT]: { label: "Gerente" },
  [VoluntaryRole.ADMIN]: { label: "Administrador" },
};

function RoleSelect({ value, onChange }: RoleSelectProps) {
  return (
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
  );
}

export default RoleSelect;
