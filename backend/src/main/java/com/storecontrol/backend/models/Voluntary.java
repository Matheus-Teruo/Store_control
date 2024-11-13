package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.voluntary.RequestCreateVoluntary;
import com.storecontrol.backend.controllers.request.voluntary.RequestUpdateVoluntary;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "volunteers")
@Getter
@NoArgsConstructor
public class Voluntary {
  @Id @GeneratedValue(generator = "UUID")
  private UUID uuid;
  @Embedded
  private User user;
  private String fullname;
  @ManyToOne @JoinColumn(name = "stand_uuid")
  private Stand stand;
  @OneToMany(mappedBy = "voluntary")
  private List<Sale> sales;
  @OneToMany(mappedBy = "voluntary")
  private List<Recharge> recharges;
  @OneToMany(mappedBy = "voluntary")
  private List<Donation> donations;
  private Boolean superuser;
  private Boolean valid;

  public Voluntary(@Valid RequestCreateVoluntary request) {
    this.user = new User(request.username(), request.password(), request.salt());
    this.fullname = request.fullname();
    this.superuser = false;
    this.valid = true;
  }

  public void updateVoluntary(RequestUpdateVoluntary request) {
    if (request.username() != null || request.password() != null || request.salt() != null) {
      this.user.updateUser(request.username(), request.password(), request.salt());
    }
    if (request.fullname() != null) {
      this.fullname = request.fullname();
    }
  }

  public void updateVoluntary(Stand stand){
    this.stand = stand;
  }

  public void deleteVoluntary() {
    this.valid = false;
  }
}
