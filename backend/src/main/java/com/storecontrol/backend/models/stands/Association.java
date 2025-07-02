package com.storecontrol.backend.models.stands;

import com.storecontrol.backend.models.stands.request.RequestCreateAssociation;
import com.storecontrol.backend.models.stands.request.RequestUpdateAssociation;
import com.storecontrol.backend.models.volunteers.Function;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Random;
import java.util.UUID;

@Entity
@Table(name = "associations")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Association {

    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;

    @Column(name = "association_name", nullable = false)
    private String associationName;

    @Column(name = "principal_name", nullable = false)
    private String principalName;

    @Column(name = "association_key", nullable = false)
    private String associationKey;

    @OneToMany(mappedBy = "association")
    private List<Stand> stands;

    @Column(nullable = false)
    private boolean valid;


    public Association(@Valid RequestCreateAssociation request) {
        this.associationName = request.associationName();
        this.principalName = request.principalName();
        this.associationKey = request.associationKey();
        this.valid = true;
    }

    public void updateAssociation(RequestUpdateAssociation request) {
        if (request.associationName() != null) {
            this.associationName = request.associationName();
        }
        if (request.principalName() != null) {
            this.principalName = request.principalName();
        }
        if (request.associationKey() != null) {
            this.associationKey = request.associationKey();
        }
    }

    public void deleteAssociation() {
        this.associationName = this.associationName + "_deleted_" + generateRandomString();
        this.valid = false;

        for (Stand stand : stands.stream().filter(Function::isValid).toList()) {
            stand.deleteFunction();
        }
    }

    private String generateRandomString() {
        String chars = "abcdefghijklmnopqrstuvwxyz";
        StringBuilder sb = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < 3; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }

        return sb.toString();
    }
}
