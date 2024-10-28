package com.storecontrol.backend.models;

import java.util.List;
import java.util.UUID;

public class Stand {
    private UUID uuid;
    private String stand;
    private Association association;
    private List<User> volunteers;
    private List<Item> items;
}
