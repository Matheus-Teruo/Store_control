package com.storecontrol.backend.models;

import java.util.List;
import java.util.UUID;

public class Association {
    private UUID uuid;
    private String association;
    private String principalName;
    private User principal;
    private List<Stand> stands;
}
