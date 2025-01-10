package com.storecontrol.backend.repositories.operations;

import com.storecontrol.backend.models.operations.Recharge;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RechargeRepository extends JpaRepository<Recharge, UUID> {
  @Query("select r from Recharge r where r.valid = true and r.uuid = :uuid")
  Optional<Recharge> findByUuidValidTrue(UUID uuid);

  @Query("select r from Recharge r where r.valid = true")
  Page<Recharge> findAllValidTrue(Pageable pageable);

  @Query("select r from Recharge r where r.valid = true and r.voluntary.uuid = :voluntaryUuid order by r.rechargeTimeStamp desc limit 3")
  List<Recharge> findLast3ValidTrue(UUID voluntaryUuid);

  @Query("select r from Recharge r where r.voluntary.uuid = :userUuid order by r.rechargeTimeStamp desc limit 1")
  Optional<Recharge> findLastFromVoluntary(UUID userUuid);
}
