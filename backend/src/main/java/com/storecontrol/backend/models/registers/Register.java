package com.storecontrol.backend.models.registers;

import com.storecontrol.backend.models.operations.recharges.Recharge;
import com.storecontrol.backend.models.operations.finalization.Refund;
import com.storecontrol.backend.models.operations.transactions.Transaction;
import com.storecontrol.backend.models.registers.request.RequestCreateRegister;
import com.storecontrol.backend.models.registers.request.RequestUpdateRegister;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.volunteers.Function;
import com.storecontrol.backend.models.volunteers.Voluntary;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "registers")
@Getter
@NoArgsConstructor
public class Register extends Function {

  @OneToOne(fetch = FetchType.LAZY) @JoinColumn(name = "stand_uuid")
  private Stand relatedStand;

  @Column(name = "stand_uuid", insertable=false, updatable=false)
  private UUID standUuid;

  @Column(name = "total_cash", nullable = false)
  private BigDecimal totalCash;

  @Column(name = "total_credit", nullable = false)
  private BigDecimal totalCredit;

  @Column(name = "total_debit", nullable = false)
  private BigDecimal totalDebit;

  @Column(name = "total_pix", nullable = false)
  private BigDecimal totalPix;

  @OneToMany(mappedBy = "register")
  private List<Transaction> transactions;

  @OneToMany(mappedBy = "register")
  private List<Recharge> recharges;

  @OneToMany(mappedBy = "register")
  private List<Refund> refunds;

  public Register(UUID uuid,
                  String functionName,
                  List<Voluntary> volunteers,
                  boolean valid) {
    super(uuid, functionName, volunteers, valid);
    this.totalCash = BigDecimal.ZERO;
    this.totalCredit = BigDecimal.ZERO;
    this.totalDebit = BigDecimal.ZERO;
    this.totalPix = BigDecimal.ZERO;
  }

  public Register(RequestCreateRegister request) {
    super(request.registerName());
    this.totalCash = BigDecimal.ZERO;
    this.totalCredit = BigDecimal.ZERO;
    this.totalDebit = BigDecimal.ZERO;
    this.totalPix = BigDecimal.ZERO;
  }

  public Register(RequestCreateRegister request, Stand stand) {
    super(request.registerName());
    this.relatedStand = stand;
    this.totalCash = BigDecimal.ZERO;
    this.totalCredit = BigDecimal.ZERO;
    this.totalDebit = BigDecimal.ZERO;
    this.totalPix = BigDecimal.ZERO;
  }

  public void updateRegister(RequestUpdateRegister request) {
    if (request.registerName() != null) {
      super.updateFunctionName(request.registerName());
    }
  }

  public void incrementCash(BigDecimal value) {
    this.totalCash = totalCash.add(value);
  }

  public void incrementCredit(BigDecimal value) {
    this.totalCredit = totalCredit.add(value);
  }

  public void incrementDebit(BigDecimal value) {
    this.totalDebit = totalDebit.add(value);
  }

  public void incrementPix(BigDecimal value) {
    this.totalPix = totalPix.add(value);
  }
}
