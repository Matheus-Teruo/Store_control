package com.storecontrol.backend.repositories.stands;

import com.storecontrol.backend.models.stands.Association;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AssociationRepository extends JpaRepository<Association, UUID> {
  @Query("SELECT a FROM Association a WHERE a.valid = true AND a.uuid = :uuid")
  Optional<Association> findByUuidValidTrue(UUID uuid);

  @Query("SELECT a.uuid FROM Association a WHERE a.valid = true AND a.associationKey = :associationKey")
  Optional<UUID> findByKeyValidTrue(String associationKey);

  @Query("SELECT a FROM Association a WHERE a.valid = true")
  Page<Association> findAllValidTruePage(Pageable pageable);

  @Query("SELECT a FROM Association a WHERE a.valid = true ORDER BY a.associationName ASC")
  List<Association> findAllValidTrue();

  boolean existsByAssociationName(String associationName);

  boolean existsByAssociationKey(String associationKey);
}
