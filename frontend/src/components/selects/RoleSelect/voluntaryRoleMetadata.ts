import { VoluntaryRole } from "@data/volunteers/Voluntary";

export const VoluntaryRoleMetadata: Record<VoluntaryRole, { label: string }> = {
  [VoluntaryRole.VOLUNTARY]: { label: "Voluntario" },
  [VoluntaryRole.MANAGEMENT]: { label: "Gerente" },
  [VoluntaryRole.ADMIN]: { label: "Administrador" },
};
