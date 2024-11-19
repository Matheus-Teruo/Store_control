package com.storecontrol.backend.models.stands;

import com.storecontrol.backend.controllers.stands.request.RequestAssociation;
import com.storecontrol.backend.controllers.stands.request.RequestUpdateAssociation;
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

    @Column(name = "association_name", nullable = false)
    private String associationName;

    @Column(name = "principal_name", nullable = false)
    private String principalName;

    @OneToMany(mappedBy = "association")
    private List<Stand> stands;

    @Column(nullable = false)
    private boolean valid;


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
