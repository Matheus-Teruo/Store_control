package com.storecontrol.backend.repositories.operations;

import com.storecontrol.backend.models.operations.purchases.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PurchaseRepository extends JpaRepository<Purchase, UUID> {
  @Query("select p from Purchase p where p.valid = true and p.uuid = :uuid")
  Optional<Purchase> findByUuidValidTrue(UUID uuid);

  @Query("select p from Purchase p where p.valid = true")
  List<Purchase> findAllValidTrue();
}
