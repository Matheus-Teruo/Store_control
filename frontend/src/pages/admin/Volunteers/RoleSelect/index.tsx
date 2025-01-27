import { VoluntaryRole } from "@data/volunteers/Voluntary";

interface RoleSelectProps {
  value: VoluntaryRole | undefined;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const VoluntaryRoleMetadata: Record<VoluntaryRole, { label: string }> = {
  [VoluntaryRole.VOLUNTARY]: { label: "Voluntario" },
  [VoluntaryRole.MANAGEMENT]: { label: "Gerente" },
  [VoluntaryRole.ADMIN]: { label: "Administrador" },
};

function RoleSelect({ value, onChange }: RoleSelectProps) {
  return (
    <div>
      {/* <label htmlFor="roles"></label> TODO: trocar para svg */}
      <select id="roles" value={value} onChange={onChange}>
        <option value={undefined}></option>
        {Object.entries(VoluntaryRoleMetadata).map(([key, { label }]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default RoleSelect;
