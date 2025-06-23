package com.storecontrol.backend.repositories.resgisters;

import com.storecontrol.backend.models.registers.Register;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RegisterRepository extends JpaRepository<Register, UUID> {
  @Query("SELECT r FROM Register r WHERE r.valid = true AND r.uuid = :uuid")
  Optional<Register> findByUuidValidTrue(UUID uuid);

  @Query("SELECT r FROM Register r WHERE r.valid = true")
  Page<Register> findAllValidTruePage(Pageable pageable);

  @Query("SELECT r FROM Register r WHERE r.valid = true ORDER BY r.functionName ASC")
  List<Register> findAllValidTrue();
}
