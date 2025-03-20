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
  @Query("select a from Association a where a.valid = true and a.uuid = :uuid")
  Optional<Association> findByUuidValidTrue(UUID uuid);

  @Query("select a.uuid from Association a where a.valid = true and a.associationKey = :associationKey")
  Optional<UUID> findByKeyValidTrue(String associationKey);

  @Query("select a from Association a where a.valid = true")
  Page<Association> findAllValidTruePage(Pageable pageable);

  @Query("select a from Association a where a.valid = true")
  List<Association> findAllValidTrue();

  boolean existsByAssociationName(String associationName);

  boolean existsByAssociationKey(String associationKey);
}
