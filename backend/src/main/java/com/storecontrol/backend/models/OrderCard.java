package com.storecontrol.backend.models;

import java.math.BigDecimal;
import java.util.List;

public class OrderCard {
    private Long id;
    private BigDecimal debit;
    private List<Sale> sales;
    private List<Customer> curtomers;
    private List<Donation> donations;
    private List<Recharge> recharges;
    private Boolean active;
}
