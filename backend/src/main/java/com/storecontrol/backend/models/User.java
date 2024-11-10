package com.storecontrol.backend.models;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String username;
    private String password;
    private String salt;

    public void updateUser(String username, String password, String salt) {
        if (username != null) {
            this.username = username;
        }
        if (password != null) {
            this.password = password;
        }
        if (salt != null) {
            this.salt = salt;
        }
    }
}
