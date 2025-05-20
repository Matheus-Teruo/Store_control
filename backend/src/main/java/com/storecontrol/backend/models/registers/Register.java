package com.storecontrol.backend.models.registers;

import com.storecontrol.backend.models.operations.recharges.Recharge;
import com.storecontrol.backend.models.operations.finalization.Refund;
import com.storecontrol.backend.models.operations.transactions.Transaction;
import com.storecontrol.backend.models.registers.request.RequestCreateRegister;
import com.storecontrol.backend.models.registers.request.RequestUpdateRegister;
import com.storecontrol.backend.models.volunteers.Function;
import com.storecontrol.backend.models.volunteers.Voluntary;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "cash_registers")
@Getter
@NoArgsConstructor
public class Register extends Function {

  @Column(name = "cash_total", nullable = false)
  private BigDecimal cashTotal;

  @Column(name = "credit_total", nullable = false)
  private BigDecimal creditTotal;

  @Column(name = "debit_total", nullable = false)
  private BigDecimal debitTotal;

  @Column(name = "pix_total", nullable = false)
  private BigDecimal pixTotal;

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
    this.cashTotal = BigDecimal.ZERO;
    this.creditTotal = BigDecimal.ZERO;
    this.debitTotal = BigDecimal.ZERO;
    this.pixTotal = BigDecimal.ZERO;
  }

  public Register(RequestCreateRegister request) {
    super(request.registerName());
    this.cashTotal = BigDecimal.ZERO;
    this.creditTotal = BigDecimal.ZERO;
    this.debitTotal = BigDecimal.ZERO;
    this.pixTotal = BigDecimal.ZERO;
  }

  public void updateRegister(RequestUpdateRegister request) {
    if (request.registerName() != null) {
      super.updateFunctionName(request.registerName());
    }
  }

  public void incrementCash(BigDecimal value) {
    this.cashTotal = cashTotal.add(value);
  }

  public void incrementCredit(BigDecimal value) {
    this.creditTotal = creditTotal.add(value);
  }

  public void incrementDebit(BigDecimal value) {
    this.debitTotal = debitTotal.add(value);
  }

  public void incrementPix(BigDecimal value) {
    this.pixTotal = pixTotal.add(value);
  }
}
