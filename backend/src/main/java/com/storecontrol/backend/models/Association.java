package com.storecontrol.backend.models;

import com.storecontrol.backend.controllers.request.association.RequestAssociation;
import com.storecontrol.backend.controllers.request.association.RequestUpdateAssociation;
import jakarta.persistence.*;
import jakarta.validation.Valid;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "associations")
@Getter
@NoArgsConstructor
public class Association {
    @Id @GeneratedValue(generator = "UUID")
    private UUID uuid;
    @Column(name = "association_name")
    private String associationName;
    @Column(name = "principal_name")
    private String principalName;
    @OneToMany(mappedBy = "association")
    private List<Stand> stands;
    private Boolean valid;

    public Association(@Valid RequestAssociation request) {
        this.associationName = request.associationName();
        this.principalName = request.principalName();
        this.valid = true;
    }

    public void updateAssociation(RequestUpdateAssociation request) {
        if (request.associationName() != null) {
            this.associationName = request.associationName();
        }
        if (request.principalName() != null) {
            this.principalName = request.principalName();
        }
    }

    public void deleteAssociation() {
        this.valid = false;
    }
}
