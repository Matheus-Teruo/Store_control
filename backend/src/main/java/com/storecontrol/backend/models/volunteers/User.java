package com.storecontrol.backend.models.volunteers;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;


    public void updateUser(String username, String password, boolean passwordFlag) {
        if (username != null) {
            this.username = username;
        }
        if (passwordFlag) {
            this.password = password;
        }
    }
}
