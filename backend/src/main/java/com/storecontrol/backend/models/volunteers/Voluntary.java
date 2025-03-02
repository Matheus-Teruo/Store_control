package com.storecontrol.backend.models.volunteers;

import com.storecontrol.backend.models.enumerate.VoluntaryRole;
import com.storecontrol.backend.models.operations.Donation;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.Refund;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.stands.Association;
import com.storecontrol.backend.models.volunteers.request.RequestVoluntaryRole;
import com.storecontrol.backend.models.volunteers.request.RequestSignupVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntary;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "volunteers")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Voluntary implements UserDetails {

  @Id @GeneratedValue(generator = "UUID")
  private UUID uuid;

  @Embedded
  private User user;

  @Column(nullable = false)
  private String fullname;

  @ManyToOne @JoinColumn(name = "function_uuid")
  private Function function;

  @Column(name = "related_association_uuid", updatable = false)
  private UUID associationUuid;

  @OneToMany(mappedBy = "voluntary")
  private List<Purchase> purchases;

  @OneToMany(mappedBy = "voluntary")
  private List<Recharge> recharges;

  @OneToMany(mappedBy = "voluntary")
  private List<Donation> donations;

  @OneToMany(mappedBy = "voluntary")
  private List<Refund> refunds;

  @Column(name = "voluntary_role", nullable = false)
  @Enumerated(EnumType.STRING)
  private VoluntaryRole voluntaryRole;

  @Column(nullable = false)
  private boolean valid;

  public Voluntary(RequestSignupVoluntary request, User user, UUID associationUuid) {
    this.user = user;
    this.fullname = request.fullname();
    this.associationUuid = associationUuid;
    this.voluntaryRole = VoluntaryRole.ROLE_USER;
    this.valid = true;
  }

  public Voluntary(User user, String fullname) {
    this.user = user;
    this.fullname = fullname;
    this.voluntaryRole = VoluntaryRole.ROLE_ADMIN;
    this.valid = true;
  }

  public void updateVoluntary(RequestUpdateVoluntary request, String password) {
    if (request.username() != null || request.password() != null) {
      this.user.updateUser(request.username(), password);
    }
    if (request.fullname() != null) {
      this.fullname = request.fullname();
    }
  }

  public void updateVoluntary(Function function){
    this.function = function;
  }

  public void updateVoluntaryRole(RequestVoluntaryRole request) {
    this.voluntaryRole = VoluntaryRole.fromString(request.voluntaryRole());
  }

  public void deleteVoluntary() {
    this.valid = false;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of((GrantedAuthority) () -> voluntaryRole.name());
  }

  @Override
  public String getUsername() {
    return user.getUsername();
  }

  @Override
  public String getPassword() {
    return user.getPassword();
  }

  @Override
  public boolean isAccountNonExpired() {
    return UserDetails.super.isAccountNonExpired();
  }

  @Override
  public boolean isAccountNonLocked() {
    return UserDetails.super.isAccountNonLocked();
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return UserDetails.super.isCredentialsNonExpired();
  }

  @Override
  public boolean isEnabled() {
    return UserDetails.super.isEnabled();
  }
}
