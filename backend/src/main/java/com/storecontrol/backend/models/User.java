package com.storecontrol.backend.models;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
public class User {
    private String username;
    private String password;
    private String salt;
}
