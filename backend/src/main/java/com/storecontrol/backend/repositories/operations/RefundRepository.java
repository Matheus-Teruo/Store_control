package com.storecontrol.backend.repositories.operations;

import com.storecontrol.backend.models.operations.Refund;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RefundRepository extends JpaRepository<Refund, UUID> {
  @Query("select r from Refund r where r.valid = true and r.uuid = :uuid")
  Optional<Refund> findByUuidValidTrue(UUID uuid);

  @Query("select r from Refund r where r.valid = true")
  List<Refund> findAllValidTrue();
}