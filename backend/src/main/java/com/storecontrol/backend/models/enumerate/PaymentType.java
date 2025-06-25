package com.storecontrol.backend.models.enumerate;

public enum PaymentType {
    CASH("cash"),
    CREDIT("credit"),
    DEBIT("debit"),
    PIX("pix");

    private final String paymentTypeLower;

    PaymentType(String paymentTypeLower) {
        this.paymentTypeLower = paymentTypeLower;
    }

    public static PaymentType fromString(String type) {
        for(PaymentType paymentType : PaymentType.values()) {
            if (paymentType.paymentTypeLower.equalsIgnoreCase(type)){
                return paymentType;
            }
        }
        throw new IllegalArgumentException("No payment type found from the passed String");
    }
}
