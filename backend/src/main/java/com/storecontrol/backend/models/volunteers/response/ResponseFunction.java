package com.storecontrol.backend.models.volunteers.response;

import com.storecontrol.backend.models.registers.CashRegister;
import com.storecontrol.backend.models.registers.response.ResponseCashRegister;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.response.ResponseStand;
import com.storecontrol.backend.models.volunteers.Function;

import java.util.UUID;

public record ResponseFunction(
    UUID uuid,
    String functionName,
    Object function
) {

  public ResponseFunction(Function function) {
    this(function.getUuid(),
        function.getFunctionName(),
        function instanceof Stand ?
            new ResponseStand((Stand) function) :
            new ResponseCashRegister((CashRegister) function)
    );
  }
}
