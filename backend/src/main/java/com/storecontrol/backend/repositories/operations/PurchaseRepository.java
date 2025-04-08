package com.storecontrol.backend.repositories.operations;

import com.storecontrol.backend.models.operations.purchases.Purchase;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PurchaseRepository extends JpaRepository<Purchase, UUID> {
  @Query("SELECT p FROM Purchase p WHERE p.valid = true AND p.uuid = :uuid")
  Optional<Purchase> findByUuidValidTrue(UUID uuid);

  @Query("SELECT p FROM Purchase p WHERE p.valid = true AND (:standUuid is null OR p.standUuid = :standUuid)")
  Page<Purchase> findAllValidTrue(UUID standUuid, Pageable pageable);

  @Query("SELECT p FROM Purchase p WHERE p.valid = true AND p.voluntary.uuid = :voluntaryUuid ORDER BY p.purchaseTimeStamp DESC limit 3")
  List<Purchase> findLast3ValidTrue(UUID voluntaryUuid);

  @Query("SELECT p FROM Purchase p WHERE p.voluntary.uuid = :userUuid ORDER BY p.purchaseTimeStamp DESC limit 1")
  Optional<Purchase> findLastFromVoluntary(UUID userUuid);
}
