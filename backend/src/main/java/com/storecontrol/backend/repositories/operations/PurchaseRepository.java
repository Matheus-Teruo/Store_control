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
  @Query("select p from Purchase p where p.valid = true and p.uuid = :uuid")
  Optional<Purchase> findByUuidValidTrue(UUID uuid);

  @Query("select p from Purchase p where p.valid = true")
  Page<Purchase> findAllValidTrue(Pageable pageable);

  @Query("select p from Purchase p where p.valid = true and p.voluntary.uuid = :voluntaryUuid order by p.purchaseTimeStamp desc limit 3")
  List<Purchase> findLast3ValidTrue(UUID voluntaryUuid);

  @Query("select p from Purchase p where p.voluntary.uuid = :userUuid order by p.purchaseTimeStamp desc limit 1")
  Optional<Purchase> findLastFromVoluntary(UUID userUuid);
}
