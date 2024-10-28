package com.storecontrol.backend.models;

import java.util.List;
import java.util.UUID;

public class User {
    private UUID uuid;
    private String username;
    private String password;
    private String salt;
    private String fullname;
    private Stand stand;
    private List<Sale> sales;
    private List<Customer> customers;
    private List<Recharge> recharges;
    private List<Donation> donations;
    private Boolean superUser;
    private Boolean active;
}
