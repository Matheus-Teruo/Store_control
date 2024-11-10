package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.voluntary.RequestUpdateVoluntary;
import com.storecontrol.backend.controllers.request.voluntary.RequestVoluntary;
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
  @OneToOne(mappedBy = "principal")
  private Association association;
  @ManyToOne @JoinColumn(name = "stand_id")
  private Stand stand;
  @OneToMany(mappedBy = "voluntary")
  private List<Sale> sales;
  @OneToMany(mappedBy = "voluntary")
  private List<Customer> customers;
  @OneToMany(mappedBy = "voluntary")
  private List<Recharge> recharges;
  @OneToMany(mappedBy = "voluntary")
  private List<Donation> donations;
  private Boolean superUser;
  private Boolean valid;

  public Voluntary(@Valid RequestVoluntary request) {
    this.user = new User(request.username(), request.password(), request.salt());
    this.fullname = request.fullname();
    this.valid = true;
  }

  public void updateVoluntary(RequestUpdateVoluntary request, Association association, Stand stand) {
    if (request.username() != null || request.password() != null || request.salt() != null) {
      this.user.updateUser(request.username(), request.password(), request.salt());
    }
    if (request.fullname() != null) {
      this.fullname = request.fullname();
    }
    if (request.associationId() != null) {
      this.association = association;
    }
    if (request.standId() != null) {
      this.stand = stand;
    }
    if (request.superUser() != null) {
      this.superUser = request.superUser();
    }
  }

  public void deleteVoluntary() {
    this.valid = false;
  }
}
