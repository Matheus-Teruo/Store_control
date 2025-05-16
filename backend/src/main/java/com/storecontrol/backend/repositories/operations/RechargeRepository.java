package com.storecontrol.backend.repositories.operations;

import com.storecontrol.backend.models.operations.recharges.Recharge;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RechargeRepository extends JpaRepository<Recharge, UUID> {
  @Query("SELECT r FROM Recharge r WHERE r.valid = true AND r.uuid = :uuid")
  Optional<Recharge> findByUuidValidTrue(UUID uuid);

  @Query("SELECT r FROM Recharge r WHERE r.valid = true")
  Page<Recharge> findAllValidTrue(Pageable pageable);

  @Query("SELECT r FROM Recharge r WHERE r.valid = true")
  List<Recharge> findAllValid();

  @Query("SELECT r FROM Recharge r WHERE r.valid = true AND r.voluntary.uuid = :voluntaryUuid ORDER BY r.rechargeTimeStamp DESC limit 3")
  List<Recharge> findLast3ValidTrue(UUID voluntaryUuid);

  @Query("SELECT r FROM Recharge r WHERE r.valid = true AND r.voluntary.uuid = :userUuid ORDER BY r.rechargeTimeStamp DESC limit 1")
  Optional<Recharge> findLastFromVoluntary(UUID userUuid);
}
