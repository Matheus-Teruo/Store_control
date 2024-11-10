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
    private String association;
    @Column(name = "principal_name")
    private String principalName;
    @OneToOne @JoinColumn(name = "principal_id")
    private Voluntary principal;
    @OneToMany(mappedBy = "association")
    private List<Stand> stands;
    private Boolean valid;

    public Association(@Valid RequestAssociation request) {
        this.association = request.association();
        this.principalName = request.principalName();
        this.principal = request.principal();
        this.valid = true;
    }

    public void updateAssociation(RequestUpdateAssociation request) {
        if (request.association() != null) {
            this.association = request.association();
        }
        if (request.principalName() != null) {
            this.principalName = request.principalName();
        }
        if (request.principal() != null) {
            this.principal = request.principal();
        }
        if (request.stands() != null) {
            this.stands = request.stands();
        }
    }

    public void deleteAssociation() {
        this.valid = false;
    }
}
