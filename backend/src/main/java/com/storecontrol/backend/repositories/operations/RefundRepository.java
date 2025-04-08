package com.storecontrol.backend.repositories.operations;

import com.storecontrol.backend.models.operations.Refund;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface RefundRepository extends JpaRepository<Refund, UUID> {
  @Query("SELECT r FROM Refund r WHERE r.valid = true AND r.uuid = :uuid")
  Optional<Refund> findByUuidValidTrue(UUID uuid);

  @Query("SELECT r FROM Refund r WHERE r.valid = true")
  Page<Refund> findAllValidTrue(Pageable pageable);
}