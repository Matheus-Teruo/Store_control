package com.storecontrol.backend.models;

import jakarta.persistence.*;
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
  private Boolean active;
}
