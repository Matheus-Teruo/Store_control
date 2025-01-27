package com.storecontrol.backend.models.enumerate;

public enum VoluntaryRole {
  ROLE_USER("voluntary", false),
  ROLE_MANAGEMENT("management",false),
  ROLE_ADMIN("admin",true);

  private final String voluntaryRoleLower;
  private final boolean typeBoolean;

  VoluntaryRole(String voluntaryRoleLower, boolean typeBoolean) {
    this.voluntaryRoleLower = voluntaryRoleLower;
    this.typeBoolean = typeBoolean;
  }

  public static VoluntaryRole fromString(String type) {
    for(VoluntaryRole voluntaryRoleLower : VoluntaryRole.values()) {
      if (voluntaryRoleLower.voluntaryRoleLower.equalsIgnoreCase(type)){
        return voluntaryRoleLower;
      }
    }
    throw new IllegalArgumentException("No role type found from the passed String");
  }

  public String toString() {
    return this.voluntaryRoleLower;
  }

  public boolean isNotAdmin() {
    return !this.typeBoolean;
  }
}
