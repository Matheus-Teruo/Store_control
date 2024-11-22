package com.storecontrol.backend.models.volunteers;

import com.storecontrol.backend.models.volunteers.request.RequestCreateVoluntary;
import com.storecontrol.backend.models.volunteers.request.RequestUpdateVoluntary;
import com.storecontrol.backend.models.operations.Donation;
import com.storecontrol.backend.models.operations.Refund;
import com.storecontrol.backend.models.operations.purchases.Purchase;
import com.storecontrol.backend.models.operations.Recharge;
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

  @Column(nullable = false)
  private String fullname;

  @ManyToOne @JoinColumn(name = "function_uuid")
  private Function function;

  @OneToMany(mappedBy = "voluntary")
  private List<Purchase> purchases;

  @OneToMany(mappedBy = "voluntary")
  private List<Recharge> recharges;

  @OneToMany(mappedBy = "voluntary")
  private List<Donation> donations;

  @OneToMany(mappedBy = "voluntary")
  private List<Refund> refunds;

  @Column(nullable = false)
  private boolean superuser;

  @Column(nullable = false)
  private boolean valid;


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

  public void updateVoluntary(Function function){
    this.function = function;
  }

  public void deleteVoluntary() {
    this.valid = false;
  }
}
