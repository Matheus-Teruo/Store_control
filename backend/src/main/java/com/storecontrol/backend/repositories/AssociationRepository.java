package com.storecontrol.backend.repositories;

import com.storecontrol.backend.models.Association;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AssociationRepository extends JpaRepository<Association, UUID> {
  @Query("select a from Association a where a.valid = true and a.uuid = :uuid")
  Optional<Association> findByUuidValidTrue(UUID uuid);

  @Query("select a from Association a where a.valid = true")
  List<Association> findAllValidTrue();
}
