package com.storecontrol.backend.models.enumerate;

public enum PaymentType {
    CASH("cash", "CASH"),
    CREDIT("credit", "CREDIT_CARD"),
    DEBIT("debit", "DEBIT_CARD"),
    PIX("pix", "PIX");

    private final String paymentTypeLower;
    private final String externalString;

    PaymentType(String paymentTypeLower, String externalString) {
        this.paymentTypeLower = paymentTypeLower;
        this.externalString = externalString;
    }

    public static PaymentType fromString(String type) {
        for(PaymentType paymentType : PaymentType.values()) {
            if (paymentType.paymentTypeLower.equalsIgnoreCase(type)){
                return paymentType;
            }
        }
        throw new IllegalArgumentException("No payment type found from the passed String");
    }

    public static PaymentType fromExternalString(String type) {
        for(PaymentType paymentType : PaymentType.values()) {
            if (paymentType.externalString.equalsIgnoreCase(type)){
                return paymentType;
            }
        }
        return PaymentType.CASH;
    }
}
