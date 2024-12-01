package com.storecontrol.backend.models.enumerate;

public enum TransactionType {
  ENTRY("entry", false),
  EXIT("exit", true);

  private final String transactionTypeLower;
  private final boolean typeBoolean;

  TransactionType(String transactionTypeLower, boolean typeBoolean) {
    this.transactionTypeLower = transactionTypeLower;
    this.typeBoolean = typeBoolean;
  }

  public static TransactionType fromString(String type) {
    for(TransactionType transactionType : TransactionType.values()) {
      if (transactionType.transactionTypeLower.equalsIgnoreCase(type)){
        return transactionType;
      }
    }
    throw new IllegalArgumentException("No transition type found from the passed String");
  }

  public boolean isExit() {
    return this.typeBoolean;
  }
}
