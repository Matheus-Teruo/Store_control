package com.storecontrol.backend.models.registers;

import com.storecontrol.backend.models.registers.request.RequestCreateCashRegister;
import com.storecontrol.backend.models.registers.request.RequestUpdateCashRegister;
import com.storecontrol.backend.models.operations.Recharge;
import com.storecontrol.backend.models.operations.Refund;
import com.storecontrol.backend.models.operations.Transaction;
import com.storecontrol.backend.models.volunteers.Function;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "cash_registers")
@Getter
@NoArgsConstructor
public class CashRegister extends Function {

  @Column(name = "cash_total", nullable = false)
  private BigDecimal cashTotal;

  @Column(name = "credit_total", nullable = false)
  private BigDecimal creditTotal;

  @Column(name = "debit_total", nullable = false)
  private BigDecimal debitTotal;

  @OneToMany(mappedBy = "cashRegister")
  private List<Transaction> transactions;

  @OneToMany(mappedBy = "cashRegister")
  private List<Recharge> recharges;

  @OneToMany(mappedBy = "cashRegister")
  private List<Refund> refunds;


  public CashRegister(RequestCreateCashRegister request) {
    super(request.cashRegisterName());
    this.cashTotal = BigDecimal.ZERO;
    this.creditTotal = BigDecimal.ZERO;
    this.debitTotal = BigDecimal.ZERO;
  }

  public void updateCashRegister(RequestUpdateCashRegister request) {
    if (request.cashRegisterName() != null) {
      super.updateFunctionName(request.cashRegisterName());
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
}
